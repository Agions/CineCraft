/**
 * 漫剧生成工作流服务
 * 小说 → 剧本 → 分镜 → 角色 → 场景 → 动画 → 配音 → 导出
 */

import { novelService } from './novel.service';
import { consistencyService } from './consistency.service';
import { aiService } from './ai.service';
import { storageService } from './storage.service';
import type {
  NovelParseResult,
  Script,
  ScriptScene,
  Storyboard,
  Character
} from '@/core/types';

// 工作流步骤
export type DramaWorkflowStep =
  | 'novel-upload'
  | 'novel-parse'
  | 'script-generate'
  | 'storyboard-generate'
  | 'character-design'
  | 'scene-render'
  | 'animation'
  | 'voiceover'
  | 'export';

// 工作流状态
export interface DramaWorkflowState {
  step: DramaWorkflowStep;
  progress: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  error?: string;
  data: DramaWorkflowData;
}

// 工作流数据
export interface DramaWorkflowData {
  projectId?: string;
  novelContent?: string;
  novelResult?: NovelParseResult;
  script?: Script;
  storyboards?: Storyboard[];
  characters?: Character[];
  scenes?: any[];
  animations?: any[];
  audio?: any;
  exportUrl?: string;
}

// 工作流配置
export interface DramaWorkflowConfig {
  autoParse: boolean;
  autoGenerateScript: boolean;
  autoGenerateStoryboard: boolean;
  chaptersToUse: number;
  scenesPerChapter: number;
  panelsPerScene: number;
  provider: string;
  model: string;
}

// 工作流事件回调
export interface DramaWorkflowCallbacks {
  onStepChange?: (step: DramaWorkflowStep, prevStep: DramaWorkflowStep) => void;
  onProgress?: (progress: number) => void;
  onStatusChange?: (status: DramaWorkflowState['status']) => void;
  onError?: (error: string) => void;
  onComplete?: (result: DramaWorkflowData) => void;
}

class DramaWorkflowService {
  private state: DramaWorkflowState;
  private callbacks: DramaWorkflowCallbacks = {};
  private abortController: AbortController | null = null;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): DramaWorkflowState {
    return {
      step: 'novel-upload',
      progress: 0,
      status: 'idle',
      data: {}
    };
  }

  setCallbacks(callbacks: DramaWorkflowCallbacks): void {
    this.callbacks = callbacks;
  }

  getState(): DramaWorkflowState {
    return { ...this.state };
  }

  private updateState(updates: Partial<DramaWorkflowState>): void {
    const prevStep = this.state.step;
    const prevStatus = this.state.status;

    this.state = { ...this.state, ...updates };

    if (updates.step && updates.step !== prevStep) {
      this.callbacks.onStepChange?.(updates.step, prevStep);
    }
    if (updates.progress !== undefined) {
      this.callbacks.onProgress?.(updates.progress);
    }
    if (updates.status && updates.status !== prevStatus) {
      this.callbacks.onStatusChange?.(updates.status);
    }
    if (updates.error) {
      this.callbacks.onError?.(updates.error);
    }
  }

  private updateData(data: Partial<DramaWorkflowData>): void {
    this.state.data = { ...this.state.data, ...data };
  }

  /**
   * 开始工作流
   */
  async start(
    projectId: string,
    novelContent: string,
    config: DramaWorkflowConfig
  ): Promise<void> {
    this.abortController = new AbortController();
    this.updateState({ status: 'running', progress: 0 });

    try {
      // Step 1: 上传小说
      this.updateData({ projectId, novelContent });
      this.updateState({ step: 'novel-upload', progress: 5 });

      // Step 2: 解析小说
      if (config.autoParse) {
        await this.stepParseNovel(novelContent, config);
      } else {
        this.updateState({ step: 'novel-parse', progress: 15 });
        return;
      }

      // Step 3: 生成剧本
      if (config.autoGenerateScript) {
        await this.stepGenerateScript(config);
      } else {
        this.updateState({ step: 'script-generate', progress: 35 });
        return;
      }

      // Step 4: 生成分镜
      if (config.autoGenerateStoryboard) {
        await this.stepGenerateStoryboards(config);
      } else {
        this.updateState({ step: 'storyboard-generate', progress: 50 });
        return;
      }

      // Step 5: 角色设计
      await this.stepDesignCharacters(config);

      // Step 6: 场景渲染
      await this.stepRenderScenes(config);

      // Step 7: 动画合成
      await this.stepAnimation(config);

      // Step 8: 配音配乐
      await this.stepVoiceover(config);

      // Step 9: 导出
      await this.stepExport(config);

      this.updateState({ status: 'completed', progress: 100 });
      this.callbacks.onComplete?.(this.state.data);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '工作流执行失败';
      this.updateState({ status: 'error', error: errorMessage });
      throw error;
    }
  }

  /**
   * 解析小说
   */
  private async stepParseNovel(
    content: string,
    config: DramaWorkflowConfig
  ): Promise<void> {
    this.updateState({ step: 'novel-parse', progress: 10 });

    const result = await novelService.parseNovel(content, {
      maxChapters: config.chaptersToUse * 2,
      provider: config.provider,
      model: config.model
    });

    this.updateData({ novelResult: result });
    this.updateState({ progress: 20 });
  }

  /**
   * 生成剧本
   */
  private async stepGenerateScript(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'script-generate', progress: 25 });

    const { novelResult } = this.state.data;
    if (!novelResult) throw new Error('小说解析结果不存在');

    const script = await novelService.generateScript(novelResult, {
      chaptersToUse: config.chaptersToUse,
      scenesPerChapter: config.scenesPerChapter,
      provider: config.provider,
      model: config.model
    });

    this.updateData({ script });
    this.updateState({ progress: 40 });
  }

  /**
   * 生成分镜
   */
  private async stepGenerateStoryboards(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'storyboard-generate', progress: 45 });

    const { script } = this.state.data;
    if (!script) throw new Error('剧本不存在');

    const allStoryboards: Storyboard[] = [];

    for (let i = 0; i < script.scenes.length; i++) {
      const scene = script.scenes[i];
      const panels = await novelService.generateStoryboard(scene, {
        panelsPerScene: config.panelsPerScene,
        provider: config.provider,
        model: config.model
      });
      allStoryboards.push(...panels);

      this.updateState({
        progress: 45 + ((i + 1) / script.scenes.length) * 15
      });
    }

    this.updateData({ storyboards: allStoryboards });
  }

  /**
   * 设计角色
   */
  private async stepDesignCharacters(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'character-design', progress: 60 });

    const { novelResult } = this.state.data;
    if (!novelResult) throw new Error('小说解析结果不存在');

    const characters: Character[] = novelResult.characters.map(char =>
      consistencyService.createCharacter({
        name: char.name,
        description: char.description,
        appearance: {
          gender: 'unknown',
          age: '未知',
          hairStyle: '',
          hairColor: '',
          eyeColor: '',
          clothing: '',
          features: []
        },
        personality: [],
        referenceImages: [],
        voice: {
          type: '',
          pitch: '',
          speed: '',
          emotion: ''
        }
      })
    );

    this.updateData({ characters });
    this.updateState({ progress: 70 });
  }

  /**
   * 渲染场景
   */
  private async stepRenderScenes(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'scene-render', progress: 75 });

    // 场景渲染逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.updateState({ progress: 80 });
  }

  /**
   * 动画合成
   */
  private async stepAnimation(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'animation', progress: 82 });

    // 动画合成逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.updateState({ progress: 88 });
  }

  /**
   * 配音配乐
   */
  private async stepVoiceover(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'voiceover', progress: 90 });

    // 配音配乐逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.updateState({ progress: 95 });
  }

  /**
   * 导出
   */
  private async stepExport(config: DramaWorkflowConfig): Promise<void> {
    this.updateState({ step: 'export', progress: 97 });

    // 导出逻辑
    this.updateData({ exportUrl: 'placeholder-url' });
    this.updateState({ progress: 100 });
  }

  /**
   * 暂停工作流
   */
  pause(): void {
    this.updateState({ status: 'paused' });
  }

  /**
   * 恢复工作流
   */
  resume(): void {
    this.updateState({ status: 'running' });
  }

  /**
   * 取消工作流
   */
  cancel(): void {
    this.abortController?.abort();
    this.updateState({ status: 'idle', progress: 0 });
  }

  /**
   * 重置工作流
   */
  reset(): void {
    this.state = this.getInitialState();
  }
}

// 导出单例
export const dramaWorkflowService = new DramaWorkflowService();
export default DramaWorkflowService;

// 导出类型
export type {
  DramaWorkflowStep,
  DramaWorkflowState,
  DramaWorkflowData,
  DramaWorkflowConfig,
  DramaWorkflowCallbacks
};
