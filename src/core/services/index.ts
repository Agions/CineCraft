/**
 * Services 统一导出
 */

export { aiService } from './ai.service';
export { videoService } from './video.service';
export { storageService } from './storage.service';
export { visionService } from './vision.service';
export { dramaWorkflowService, DramaWorkflowService } from './drama.workflow.service';
export { costService, CostService } from './cost.service';
export { consistencyService, ConsistencyService } from './consistency.service';
export { novelService, NovelService } from './novel.service';

// 重新导出类型
export type { AIResponse, RequestConfig } from './ai.service';
export type {
  DramaWorkflowStep,
  DramaWorkflowState,
  DramaWorkflowData,
  DramaWorkflowConfig,
  DramaWorkflowCallbacks
} from './drama.workflow.service';
export type {
  CostRecord,
  CostStats,
  CostBudget
} from './cost.service';
export type {
  Character,
  DramaStyle,
  ConsistencyRule,
  ConsistencyCheckpoint,
  ConsistencyIssue,
  CharacterLibrary
} from './consistency.service';
export type {
  NovelChapter,
  ScriptScene,
  Script,
  NovelParseResult,
  Storyboard
} from './novel.service';
