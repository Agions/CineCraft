import React from 'react';
import { Modal, Image, Button, Space } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';

interface PreviewModalProps {
  visible: boolean;
  type: 'image' | 'video';
  url: string | null;
  onClose: () => void;
  onDownload: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  visible,
  type,
  url,
  onClose,
  onDownload,
}) => {
  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      width={type === 'video' ? 800 : 600}
      centered
    >
      <div style={{ textAlign: 'center' }}>
        {type === 'image' && url && (
          <Image src={url} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
        )}
        {type === 'video' && url && (
          <video
            src={url}
            controls
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
            autoPlay
          />
        )}
        <Space style={{ marginTop: 16 }}>
          <Button icon={<DownloadOutlined />} onClick={onDownload}>
            下载
          </Button>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            关闭
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PreviewModal;
