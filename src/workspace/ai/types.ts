/**
 * ALLIANCE AI — SIGNATURE EXPERIENCE
 * Core Data Models & Strictly Decoupled Identifiers
 */

export type InteractionMode = 'DIRECT' | 'ANALYSIS' | 'SUGGESTION' | 'MISSION';

export type SystemOperationalState = 
  | 'IDLE' 
  | 'ANALYZING' 
  | 'PLANNING' 
  | 'EXECUTING' 
  | 'VERIFYING' 
  | 'COMPLETED' 
  | 'ERROR';

export type MissionStatus = 
  | 'DRAFT' 
  | 'PLANNING' 
  | 'READY' 
  | 'EXECUTING' 
  | 'WAITING_FOR_CONFIRMATION' 
  | 'PAUSED' 
  | 'SUCCEEDED' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export type StepExecutionStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'SUCCEEDED' 
  | 'FAILED' 
  | 'BLOCKED' 
  | 'CANCELLED';

export type StepVerificationStatus = 
  | 'PENDING' 
  | 'EXECUTING' 
  | 'EXECUTED' 
  | 'VERIFYING' 
  | 'VERIFIED' 
  | 'VERIFICATION_FAILED' 
  | 'VERIFICATION_PARTIAL' 
  | 'SKIPPED'
  | 'NONE';

/**
 * Granular Typed Content Blocks to eliminate raw Markdown rendering
 */
export type ContentBlock = 
  | { type: 'heading'; level: 1 | 2 | 3; domain?: string; text: string }
  | { type: 'text'; content: string }
  | { type: 'metric'; value: string | number; label: string; trend?: string; trendPositive?: boolean }
  | { type: 'insight'; title: string; summary: string; points: string[] }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'action'; id: string; label: string; actionType: string; payload?: any }
  | { type: 'warning'; message: string; code?: string }
  | { type: 'result'; title: string; summary: string; metrics: Array<{ label: string; value: string }>; verified: boolean }
  | { type: 'file'; name: string; size?: string; url?: string }
  | { type: 'source'; label: string; uri?: string };

/**
 * Message Model inside a conversation
 */
export interface ConversationMessage {
  id: string;             // message_id
  conversation_id: string;
  mission_id?: string;    // optional link to an active mission
  role: 'user' | 'assistant';
  content: string;
  blocks?: ContentBlock[];
  timestamp: string;
  mode?: InteractionMode;
}

/**
 * Step Model inside a Mission
 */
export interface MissionStep {
  step_id: string;        // step_id
  tool_name: string;
  arguments: Record<string, any>;
  dependencies: string[];
  status: StepExecutionStatus;
  output?: any;
  error?: string | null;
  requires_confirmation: boolean;
  verification_status?: StepVerificationStatus;
  execution_metadata?: Record<string, any>;
}

/**
 * Mission Model (Backend is the absolute Source of Truth)
 */
export interface MissionPlan {
  mission_id: string;     // plan_id
  user_request: string;
  title: string;
  status: MissionStatus;
  created_at: string;
  updated_at?: string;
  final_result?: any;
  steps: MissionStep[];
}

/**
 * Event-Driven Timeline Representation
 */
export type MissionEventType =
  | 'MissionStarted'
  | 'ContextResolved'
  | 'PlanCreated'
  | 'StepStarted'
  | 'ToolCalled'
  | 'ToolCompleted'
  | 'ConfirmationRequired'
  | 'ConfirmationReceived'
  | 'VerificationStarted'
  | 'VerificationCompleted'
  | 'MissionCompleted'
  | 'MissionFailed'
  | 'MissionCancelled';

export interface MissionEvent {
  id: string;             // execution_id
  mission_id: string;
  step_id?: string;
  type: MissionEventType;
  timestamp: string;
  label: string;
  metadata?: Record<string, any>;
}
