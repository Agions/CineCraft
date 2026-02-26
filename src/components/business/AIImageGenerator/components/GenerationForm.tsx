import React from 'react';
import { Card, Button, Input, Select, Slider, Space, Typography, Radio, Upload, Progress } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { IMAGE_STYLES, VIDEO_STYLES, GenerationProvider } from '@/core/services/generation.service';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const PROVIDER_CONFIG: { key: GenerationProvider; name: string; type: 'image' | 'video' | 'both'; desc: string }[] = [
  { key: 'bytedance-seedream', name: '字节 Seedream', type: 'image', desc: '高质量图像生成' },
  { key: 'bytedance-seedance', name: '字节 Seedance', type: 'video', desc: '高质量视频生成' },
  { key: 'kling', name: '快手可灵', type: 'both', desc: '图像+视频生成' },
  { key: 'vidu', name: '生数 Vidu', type: 'video', desc: '视频生成' },
];

const SIZE_PRESETS = [
  { label: '1:1 方形', value: '1:1' },
  { label: '16:9 宽屏', value: '16:9' },
  { label: '9:16 竖屏', value: '9:16' },
  { label: '4:3 标准', value: '4:3' },
  { label: '3:4 竖版', value: '3:4' },
];

interface GenerationFormProps {
  type: 'image' | 'video';
  prompt: string;
  negativePrompt: string;
  provider: GenerationProvider;
  style: string;
  aspectRatio: string;
  numImages: number;
  duration: 5 | 10;
  motionStrength: number;
  referenceImage: UploadFile | null;
  isGenerating: boolean;
  progress: number;
  onPromptChange: (value: string) => void;
  onNegativePromptChange: (value: string) => void;
  onProviderChange: (value: GenerationProvider) => void;
  onStyleChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onNumImagesChange: (value: number) => void;
  onDurationChange: (value: 5 | 10) => void;
  onMotionStrengthChange: (value: number) => void;
  onReferenceImageChange: (file: UploadFile | null) => void;
  onGenerate: () => void;
}

export const GenerationForm: React.FC<GenerationFormProps> = ({
  type,
  prompt,
  negativePrompt,
  provider,
  style,
  aspectRatio,
  numImages,
  duration,
  motionStrength,
  referenceImage,
  isGenerating,
  progress,
  onPromptChange,
  onNegativePromptChange,
  onProviderChange,
  onStyleChange,
  onAspectRatioChange,
  onNumImagesChange,
  onDurationChange,
  onMotionStrengthChange,
  onReferenceImageChange,
  onGenerate,
}) => {
  const availableProviders = PROVIDER_CONFIG.filter(
    (p) => p.type === type || p.type === 'both'
  );

  const styles = type === 'image' ? IMAGE_STYLES : VIDEO_STYLES;

  return (
    <Card title="生成设置">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 描述词 */}
        <div>
          <Text strong>描述词</Text>
          <TextArea
            rows={3}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={`描述你想要的${type === 'image' ? '图像' : '视频'}内容...`}
            disabled={isGenerating}
          />
        </div>

        {/* 反向描述词 */}
        <div>
          <Text strong>反向描述词（可选）</Text>
          <TextArea
            rows={2}
            value={negativePrompt}
            onChange={(e) => onNegativePromptChange(e.target.value)}
            placeholder="描述你不想要的内容..."
            disabled={isGenerating}
          />
        </div>

        {/* 提供商 */}
        <div>
          <Text strong>AI 提供商</Text>
          <Select
            style={{ width: '100%' }}
            value={provider}
            onChange={onProviderChange}
            disabled={isGenerating}
          >
            {availableProviders.map((p) => (
              <Option key={p.key} value={p.key}>
                {p.name} - {p.desc}
              </Option>
            ))}
          </Select>
        </div>

        {/* 风格 */}
        <div>
          <Text strong>风格</Text>
          <Select style={{ width: '100%' }} value={style} onChange={onStyleChange} disabled={isGenerating}>
            {styles.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* 尺寸 */}
        <div>
          <Text strong>画面比例</Text>
          <Radio.Group
            value={aspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.value)}
            disabled={isGenerating}
          >
            {SIZE_PRESETS.map((s) => (
              <Radio.Button key={s.value} value={s.value}>
                {s.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* 图像特有：数量 */}
        {type === 'image' && (
          <div>
            <Text strong>生成数量: {numImages}</Text>
            <Slider
              min={1}
              max={4}
              value={numImages}
              onChange={onNumImagesChange}
              disabled={isGenerating}
            />
          </div>
        )}

        {/* 视频特有：时长 */}
        {type === 'video' && (
          <div>
            <Text strong>视频时长</Text>
            <Radio.Group
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              disabled={isGenerating}
            >
              <Radio.Button value={5}>5 秒</Radio.Button>
              <Radio.Button value={10}>10 秒</Radio.Button>
            </Radio.Group>
          </div>
        )}

        {/* 视频特有：运动强度 */}
        {type === 'video' && (
          <div>
            <Text strong>运动强度: {Math.round(motionStrength * 100)}%</Text>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={motionStrength}
              onChange={onMotionStrengthChange}
              disabled={isGenerating}
            />
          </div>
        )}

        {/* 视频特有：参考图 */}
        {type === 'video' && (
          <div>
            <Text strong>参考图像（可选）</Text>
            <Upload
              accept="image/*"
              maxCount={1}
              fileList={referenceImage ? [referenceImage] : []}
              onRemove={() => onReferenceImageChange(null)}
              beforeUpload={(file) => {
                onReferenceImageChange(file as UploadFile);
                return false;
              }}
              disabled={isGenerating}
            >
              <Button icon={<PlusOutlined />}>上传参考图</Button>
            </Upload>
          </div>
        )}

        {/* 生成按钮 */}
        <Button
          type="primary"
          size="large"
          icon={isGenerating ? <LoadingOutlined /> : <PlusOutlined />}
          onClick={onGenerate}
          loading={isGenerating}
          block
        >
          {isGenerating ? `生成中 ${progress}%` : `开始生成${type === 'image' ? '图像' : '视频'}`}
        </Button>

        {isGenerating && <Progress percent={progress} status="active" />}
      </Space>
    </Card>
  );
};

export default GenerationForm;
