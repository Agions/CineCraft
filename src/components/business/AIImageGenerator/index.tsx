import React, { useState } from 'react';
import { Tabs, Row, Col, Modal } from 'antd';
import { PictureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { GenerationForm, TaskList, PreviewModal } from './components';
import { useGeneration } from './hooks/useGeneration';
import { GenerationProvider } from '@/core/services/generation.service';
import styles from './index.module.less';

const { TabPane } = Tabs;

const AIImageGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image');

  const {
    prompt,
    negativePrompt,
    selectedProvider,
    selectedStyle,
    aspectRatio,
    numImages,
    duration,
    motionStrength,
    referenceImage,
    isGenerating,
    progress,
    tasks,
    previewImage,
    previewVideo,
    setPrompt,
    setNegativePrompt,
    setSelectedProvider,
    setSelectedStyle,
    setAspectRatio,
    setNumImages,
    setDuration,
    setMotionStrength,
    setReferenceImage,
    generateImage,
    generateVideo,
    cancelTask,
    deleteTask,
    downloadResult,
  } = useGeneration();

  const handleGenerate = () => {
    if (activeTab === 'image') {
      generateImage();
    } else {
      generateVideo();
    }
  };

  const handlePreview = (type: 'image' | 'video') => {
    setPreviewType(type);
    setPreviewVisible(true);
  };

  const handleDownloadPreview = () => {
    const url = previewType === 'image' ? previewImage : previewVideo;
    if (url) {
      downloadResult(url, `preview_${Date.now()}.${previewType === 'image' ? 'png' : 'mp4'}`);
    }
  };

  const currentTasks = tasks.filter((t) => t.type === activeTab);

  return (
    <div className={styles.container}>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'image' | 'video')}>
        <TabPane
          tab={
            <span>
              <PictureOutlined />
              图像生成
            </span>
          }
          key="image"
        >
          <Row gutter={16}>
            <Col span={12}>
              <GenerationForm
                type="image"
                prompt={prompt}
                negativePrompt={negativePrompt}
                provider={selectedProvider}
                style={selectedStyle}
                aspectRatio={aspectRatio}
                numImages={numImages}
                duration={duration}
                motionStrength={motionStrength}
                referenceImage={referenceImage}
                isGenerating={isGenerating}
                progress={progress}
                onPromptChange={setPrompt}
                onNegativePromptChange={setNegativePrompt}
                onProviderChange={(v) => setSelectedProvider(v as GenerationProvider)}
                onStyleChange={setSelectedStyle}
                onAspectRatioChange={setAspectRatio}
                onNumImagesChange={setNumImages}
                onDurationChange={setDuration}
                onMotionStrengthChange={setMotionStrength}
                onReferenceImageChange={setReferenceImage}
                onGenerate={handleGenerate}
              />
            </Col>
            <Col span={12}>
              <TaskList
                tasks={currentTasks}
                onDownload={downloadResult}
                onCancel={cancelTask}
                onDelete={deleteTask}
              />
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <VideoCameraOutlined />
              视频生成
            </span>
          }
          key="video"
        >
          <Row gutter={16}>
            <Col span={12}>
              <GenerationForm
                type="video"
                prompt={prompt}
                negativePrompt={negativePrompt}
                provider={selectedProvider}
                style={selectedStyle}
                aspectRatio={aspectRatio}
                numImages={numImages}
                duration={duration}
                motionStrength={motionStrength}
                referenceImage={referenceImage}
                isGenerating={isGenerating}
                progress={progress}
                onPromptChange={setPrompt}
                onNegativePromptChange={setNegativePrompt}
                onProviderChange={(v) => setSelectedProvider(v as GenerationProvider)}
                onStyleChange={setSelectedStyle}
                onAspectRatioChange={setAspectRatio}
                onNumImagesChange={setNumImages}
                onDurationChange={setDuration}
                onMotionStrengthChange={setMotionStrength}
                onReferenceImageChange={setReferenceImage}
                onGenerate={handleGenerate}
              />
            </Col>
            <Col span={12}>
              <TaskList
                tasks={currentTasks}
                onDownload={downloadResult}
                onCancel={cancelTask}
                onDelete={deleteTask}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      <PreviewModal
        visible={previewVisible}
        type={previewType}
        url={previewType === 'image' ? previewImage : previewVideo}
        onClose={() => setPreviewVisible(false)}
        onDownload={handleDownloadPreview}
      />

      {/* 预览卡片 */}
      {(previewImage || previewVideo) && (
        <div className={styles.previewSection}>
          {previewImage && activeTab === 'image' && (
            <img
              src={previewImage}
              alt="预览"
              className={styles.previewImage}
              onClick={() => handlePreview('image')}
            />
          )}
          {previewVideo && activeTab === 'video' && (
            <video
              src={previewVideo}
              controls
              className={styles.previewVideo}
              onClick={() => handlePreview('video')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AIImageGenerator;
