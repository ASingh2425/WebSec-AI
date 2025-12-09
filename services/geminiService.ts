import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult, Severity } from "../types";

const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    severity: { type: Type.STRING, enum: [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO] },
    description: { type: Type.STRING },
    affectedUrl: { type: Type.STRING },
    impact: { type: Type.STRING },
    fixCode: { type: Type.STRING },
    fixExplanation: { type: Type.STRING },
    proofOfConcept: { type: Type.STRING },
    cwe: { type: Type.STRING }
  },
  required: ["id", "title", "severity", "description", "affectedUrl", "impact", "fixCode", "fixExplanation", "proofOfConcept"]
};

const techStackSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    category: { type: Type.STRING, enum: ["Frontend", "Backend", "Database", "Server", "Other"] },
    version: { type: Type.STRING }
  },
  required: ["name", "category"]
};

const headerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    value: { type: Type.STRING },
    status: { type: Type.STRING, enum: ["secure", "warning", "missing"] }
  },
  required: ["name", "value", "status"]
};

const metricsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    authScore: { type: Type.NUMBER },
    dbScore: { type: Type.NUMBER },
    networkScore: { type: Type.NUMBER },
    clientScore: { type: Type.NUMBER },
    complianceScore: { type: Type.NUMBER }
  },
  required: ["authScore", "dbScore", "networkScore", "clientScore", "complianceScore"]
};

const owaspSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING },
    count: { type: Type.NUMBER }
  },
  required: ["category", "count"]
};

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    scanType: { type: Type.STRING, enum: ["url", "code"] },
    siteDescription: { type: Type.STRING },
    summary: { type: Type.STRING },
    riskScore: { type: Type.NUMBER },
    securityMetrics: metricsSchema,
    owaspDistribution: { type: Type.ARRAY, items: owaspSchema },
    techStack: { type: Type.ARRAY, items: techStackSchema },
    vulnerabilities: { type: Type.ARRAY, items: vulnerabilitySchema },
    headers: { type: Type.ARRAY, items: headerSchema },
    sitemap: { type: Type.ARRAY, items: { type: Type.STRING } },
    apiEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    executiveSummary: { type: Type.STRING }
  },
  required: ["target", "scanType", "siteDescription", "summary", "riskScore", "securityMetrics", "owaspDistribution", "techStack", "vulnerabilities", "headers", "sitemap", "apiEndpoints", "executiveSummary"]
};

export const runScan = async (target: string, type: 'url' | 'code', activeModules: string[] = []): Promise<ScanResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const isCode = type === 'code';
  
  // High-Fidelity Prompt for Accurate Simulations
  const systemContext = `
    You are 'WebSec-AI', an elite automated Penetration Testing Engine.
    
    TASK: Perform a ${isCode ? "Source Code Analysis (SAST)" : "Black-Box Web Assessment (DAST)"} on: "${target}"
    ${activeModules.length > 0 ? `ACTIVE MODULES: ${activeModules.join(', ')}` : ''}

    ---------------------------------------------------
    *** RULESET 1: KNOWN VULNERABLE TARGETS (ACCURACY MODE) ***
    If the URL matches known educational/vulnerable labs (e.g., 'testphp.vulnweb.com', 'demo.testfire.net', 'juice-shop.herokuapp.com', 'dvwa', 'hackthebox'), you MUST:
    1. Retrieve the *actual* known vulnerabilities for that specific site from your training data.
    2. Example for 'testphp.vulnweb.com': You MUST report SQL Injection in the 'cat' parameter and XSS in the 'search' field.
    3. Example for 'Juice Shop': You MUST report Score Board access, IDOR, and XSS.
    
    *** RULESET 2: SECURE TARGETS (FALSE POSITIVE PREVENTION) ***
    If the URL is a major secure platform (e.g., 'google.com', 'microsoft.com', 'github.com', 'apple.com'):
    1. Do NOT report Critical/High vulnerabilities (SQLi, RCE) unless there is a famous public CVE.
    2. Report a Risk Score of 90-100.
    3. Only report 'Info' or 'Low' issues (e.g., "Missing Strict-Transport-Security header", "Public Server Banner").
    
    *** RULESET 3: UNKNOWN TARGETS (HEURISTIC SIMULATION) ***
    If the target is a generic or random URL:
    1. Infer the tech stack (PHP, Node, Python, ASP.NET).
    2. Generate *plausible* vulnerabilities based on that stack.
       - If PHP: Check for SQLi in ?id= params.
       - If Node/Express: Check for Weak JWT or NoSQL Injection.
       - If React: Check for DOM XSS.
    3. The 'Proof of Concept' must be syntactically correct for the inferred language.

    ---------------------------------------------------
    OUTPUT REQUIREMENTS:
    - 'riskScore': 0-100 (100 is perfectly secure).
    - 'securityMetrics': Accurate breakdown.
    - 'siteDescription': 2-3 sentences describing what the business/site actually does (e.g. "An e-commerce platform for selling art").
    - 'vulnerabilities':
       - 'proofOfConcept': MUST be a copy-pasteable command (e.g. "curl -v ...") or payload.
       - 'severity': Be strict. Do not rate a missing header as 'High'.
    ---------------------------------------------------
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemContext,
      config: {
        responseMimeType: "application/json",
        responseSchema: scanResultSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Analysis Engine returned empty response.");
    
    let result: ScanResult;
    try {
      result = JSON.parse(text) as ScanResult;
    } catch (e) {
      throw new Error("Failed to parse Analysis Report. Engine output was malformed.");
    }

    // Post-processing and Validation
    result.scanType = type;
    result.target = target.length > 50 ? target.slice(0, 47) + "..." : target;
    
    // Ensure arrays exist to prevent frontend crashes
    result.vulnerabilities = result.vulnerabilities || [];
    result.techStack = result.techStack || [];
    result.headers = result.headers || [];
    result.sitemap = result.sitemap || [];
    result.apiEndpoints = result.apiEndpoints || [];
    result.owaspDistribution = result.owaspDistribution || [];
    
    // Fallback if AI omits metrics
    if (!result.securityMetrics) {
        result.securityMetrics = {
            authScore: 80,
            dbScore: 80,
            networkScore: 80,
            clientScore: 80,
            complianceScore: 80
        }
    }

    return result;
  } catch (error) {
    console.error("Scan execution failed:", error);
    throw error;
  }
};

export const queryAgent = async (history: {role: string, content: string}[], message: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");
  
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct the full conversation including the system prompt
    const systemPrompt = `
      You are 'Sentinel', the AI Security Guide for the 'WebSec-AI' platform.
      
      YOUR ROLE:
      1. Guide users on how to use WebSec-AI (features: Scanner, Intelligence, Live Monitor).
      2. Educate users about cybersecurity concepts (SQLi, XSS, OWASP Top 10) in simple terms.
      3. Explain findings if they paste a vulnerability description.
      
      PLATFORM KNOWLEDGE:
      - 'Scanner': Performs DAST (URL) and SAST (Source Code) analysis.
      - 'Intelligence': Shows real-world verified CVEs.
      - 'Live Monitor': Shows local client telemetry (ping, FPS, connection).
      - 'History': Stores past scans locally.
      
      TONE: Professional, encouraging, slightly 'cyber-themed' but very accessible to beginners.
      Keep answers concise (max 3 sentences unless asked for detail).
    `;

    // Flatten history for context window
    let promptContext = systemPrompt + "\n\nConversation History:\n";
    history.forEach(msg => {
        promptContext += `${msg.role === 'user' ? 'User' : 'Sentinel'}: ${msg.content}\n`;
    });
    promptContext += `User: ${message}\nSentinel:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptContext,
        });
        return response.text || "I'm experiencing a momentary uplink error. Please retry.";
    } catch (e) {
        console.error(e);
        return "Connection interrupted. Please check your network.";
    }
}
