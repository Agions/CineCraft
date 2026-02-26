import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space, Badge, Tooltip } from 'antd';
import {
  ThunderboltOutlined,
  FireOutlined,
  StarOutlined,
  ClockCircleOutlined,
  RightOutlined,
  BulbOutlined,
  TrendingUpOutlined,
  HeartOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';

const { Title, Text } = Typography;

// 推荐类型
interface RecommendItem {
  id: string;
  type: 'template' | 'workflow' | 'tool' | 'tip';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tag?: string;
  tagColor?: string;
  action: () => void;
  hot?: boolean;
  new?: boolean;
}

// 推荐数据
const getRecommendations = (navigate: (path: string) => void): RecommendItem[] => [
  {
    id: '1',
    type: 'workflow',
    title: '一键生成漫剧',
    description: '输入主题，AI 自动生成完整漫剧视频',
    icon: <ThunderboltOutlined />,
    color: '#722ed1',
    tag: '热门',
    tagColor: 'red',
    action: () => navigate('/workflow'),
    hot: true,
  },
  {
    id: '2',
    type: 'template',
    title: '情感故事模板',
    description: '温馨治愈的情感类漫剧模板',
    icon: <HeartOutlined />,
    color: '#eb2f96',
    tag: '推荐',
    tagColor: 'pink',
    action: () => navigate('/workflow'),
  },
  {
    id: '3',
    type: 'tool',
    title: 'AI 图像生成',
    description: '文生图、图生视频，多种风格可选',
    icon: <FireOutlined />,
    color: '#fa8c16',
    tag: '新功能',
    tagColor: 'green',
    action: () => navigate('/workflow'),
    new: true,
  },
  {
    id: '4',
    type: 'tool',
    title: '智能配音',
    description: '60+ 音色，支持方言和情感',
    icon: <PlayCircleOutlined />,
    color: '#13c2c2',
    action: () => navigate('/workflow'),
  },
  {
    id: '5',
    type: 'template',
    title: '悬疑推理模板',
    description: '紧张刺激的悬疑类漫剧模板',
    icon: <StarOutlined />,
    color: '#1890ff',
    action: () => navigate('/workflow'),
  },
  {
    id: '6',
    type: 'tip',
    title: '创作技巧',
    description: '如何让 AI 生成更优质的剧本',
    icon: <BulbOutlined />,
    color: '#52c41a',
    tag: '技巧',
    tagColor: 'blue',
    action: () => {
      // 显示技巧弹窗
    },
  },
];

// 快捷操作
const getQuickActions = (navigate: (path: string) => void) => [
  {
    id: 'quick1',
    title: '新建项目',
    icon: <ThunderboltOutlined />,
    color: '#722ed1',
    action: () => navigate('/workflow'),
  },
  {
    id: 'quick2',
    title: '图像生成',
    icon: <FireOutlined />,
    color: '#fa8c16',
    action: () => navigate('/workflow'),
  },
  {
    id: 'quick3',
    title: '视频剪辑',
    icon: <PlayCircleOutlined />,
    color: '#13c2c2',
    action: () => navigate('/editor'),
  },
  {
    id: 'quick4',
    title: '智能配音',
    icon: <TrendingUpOutlined />,
    color: '#1890ff',
    action: () => navigate('/workflow'),
  },
];

/**
 * 推荐面板组件
 */
const RecommendPanel: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations] = useState<RecommendItem[]>(() =>
    getRecommendations(navigate)
  );
  const [quickActions] = useState(() => getQuickActions(navigate));
  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 获取问候语
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className={styles.container}>
      {/* 问候语 */}
      <div className={styles.greeting}>
        <Title level={3} className={styles.greetingTitle}>
          {getGreeting()}，开始创作吧！
        </Title>
        <Text type="secondary">
          <ClockCircleOutlined /> {currentTime.toLocaleDateString('zh-CN')} {' '}
          {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </div>

      {/* 快捷操作 */}
      <Card className={styles.quickActions} bordered={false}>
        <Title level={5}>快捷操作</Title>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col key={action.id} xs={12} sm={6}>
              <Button
                type="default"
                className={styles.quickButton}
                onClick={action.action}
                style={{ borderColor: action.color, color: action.color }}
                block
              >
                <span style={{ color: action.color }}>{action.icon}</span>
                <span>{action.title}</span>
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 推荐内容 */}
      <div className={styles.recommendations}>
        <div className={styles.sectionHeader}>
          <Title level={5}>
            <FireOutlined style={{ color: '#ff4d4f' }} /> 为你推荐
          </Title>
          <Button type="link" size="small">
            查看更多 <RightOutlined />
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {recommendations.map((item) => (
            <Col key={item.id} xs={24} sm={12} lg={8}>
              <Card
                className={styles.recommendCard}
                bordered={false}
                hoverable
                onClick={item.action}
              >
                <div className={styles.cardContent}>
                  <div
                    className={styles.iconWrapper}
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                      <Text strong className={styles.cardTitle}>
                        {item.title}
                      </Text>
                      <Space size={4}>
                        {item.hot && (
                          <Badge count="HOT" style={{ backgroundColor: '#ff4d4f' }} />
                        )}
                        {item.new && (
                          <Badge count="NEW" style={{ backgroundColor: '#52c41a' }} />
                        )}
                        {item.tag && (
                          <Tag color={item.tagColor} style={{ margin: 0 }}>
                            {item.tag}
                          </Tag>
                        )}
                      </Space>
                    </div>
                    <Text type="secondary" className={styles.cardDesc}>
                      {item.description}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 使用统计 */}
      <Card className={styles.statsCard} bordered={false}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Text type="secondary">本周创作</Text>
              <Title level={4} style={{ margin: 0 }}>
                12 个项目
              </Title>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" size={0} style={{ textAlign: 'right' }}>
              <Text type="secondary">节省时长</Text>
              <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                48 小时
              </Title>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={() => navigate('/workflow')}>
              立即创作
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default RecommendPanel;
