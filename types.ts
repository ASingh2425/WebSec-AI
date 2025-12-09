
export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  affectedUrl: string; // Or File Path for code scan
  impact: string; 
  fixCode: string; 
  fixExplanation: string;
  proofOfConcept: string; // New: Realistic curl command or payload
  cwe?: string;
}

export interface SecurityHeader {
  name: string;
  value: string;
  status: 'secure' | 'warning' | 'missing';
}

export interface TechStackItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Server' | 'Other';
  version?: string;
}

export interface SecurityMetrics {
  authScore: number;     // Authentication strength
  dbScore: number;       // Database security
  networkScore: number;  // Network config/headers
  clientScore: number;   // Client-side protection
  complianceScore: number; // GDPR/PCI-DSS compliance estimate
}

export interface OWASPItem {
  category: string;
  count: number;
}

export interface ScanResult {
  target: string; // URL or "Source Code Snippet"
  scanType: 'url' | 'code';
  siteDescription: string;
  summary: string;
  riskScore: number; 
  securityMetrics: SecurityMetrics; // New: For Radar Chart
  owaspDistribution: OWASPItem[];   // New: For Bar Chart
  techStack: TechStackItem[];
  vulnerabilities: Vulnerability[];
  headers: SecurityHeader[];
  sitemap: string[]; 
  apiEndpoints: string[]; 
  executiveSummary: string; 
  timestamp?: string; // New: For History
}

export interface ScanModule {
  name: string;
  enabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export type ScanStatus = 'idle' | 'scanning' | 'analyzing' | 'complete' | 'error';
