import React from 'react';
import { Card, List, Tag, Button, Space, Image, Empty, Typography } from 'antd';
import {
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { GenerationTask } from '@/core/services/generation.service';

const { Text } = Typography;

interface TaskListProps {
  tasks: GenerationTask[];
  onDownload: (url: string, filename: string) => void;
  onCancel: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_MAP: Record<string, { text: string; color: string; icon: React.ReactNode }> = {
  pending: { text: '等待中', color: 'default', icon: <ClockCircleOutlined /> },
  generating: { text: '生成中', color: 'processing', icon: <LoadingOutlined spin /> },
  completed: { text: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
  failed: { text: '失败', color: 'error', icon: <CloseCircleOutlined /> },
  cancelled: { text: '已取消', color: 'default', icon: <CloseCircleOutlined /> },
};

const TYPE_MAP: Record<string, string> = {
  image: '图像',
  video: '视频',
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDownload, onCancel, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <Card title="任务历史">
        <Empty description="暂无生成任务" />
      </Card>
    );
  }

  return (
    <Card title={`任务历史 (${tasks.length})`}>
      <List
        dataSource={tasks}
        renderItem={(task) => {
          const status = STATUS_MAP[task.status];
          return (
            <List.Item
              actions={[
                task.status === 'generating' && (
                  <Button key="cancel" size="small" onClick={() => onCancel(task.id)}>
                    取消
                  </Button>
                ),
                task.status === 'completed' && task.resultUrl && (
                  <Button
                    key="download"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      onDownload(
                        task.resultUrl!,
                        `${task.type}_${task.id}.${task.type === 'image' ? 'png' : 'mp4'}`
                      )
                    }
                  >
                    下载
                  </Button>
                ),
                <Button key="delete" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(task.id)}>
                  删除
                </Button>,
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  task.type === 'image' && task.resultUrl ? (
                    <Image src={task.resultUrl} width={80} height={80} style={{ objectFit: 'cover' }} />
                  ) : null
                }
                title={
                  <Space>
                    <Tag color="blue">{TYPE_MAP[task.type]}</Tag>
                    <Tag icon={status.icon} color={status.color}>
                      {status.text}
                    </Tag>
                    {task.progress > 0 && task.status === 'generating' && (
                      <Text type="secondary">{task.progress}%</Text>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text ellipsis style={{ maxWidth: 300 }} title={task.prompt}>
                      {task.prompt}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(task.createdAt).toLocaleString()}
                    </Text>
                    {task.error && (
                      <Text type="danger" style={{ fontSize: 12 }}>
                        {task.error}
                      </Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default TaskList;
