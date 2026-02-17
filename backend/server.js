const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 模拟的 API 数据
app.get('/api/profile', (req, res) => {
  res.json({
    name: '王宇亮',
    title: '前端开发工程师',
    location: '杭州、上海',
    email: 'wangyuliang@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  });
});

app.get('/api/skills', (req, res) => {
  res.json([
    'React', 'Next.js', 'TypeScript', 'Vue.js',
    'Node.js', 'Tailwind CSS', 'GraphQL', 'Git'
  ]);
});

app.get('/api/projects', (req, res) => {
  res.json([
    {
      name: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with Next.js and Node.js',
      tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
      link: '#'
    },
    {
      name: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates',
      tech: ['React', 'Firebase', 'Tailwind CSS'],
      link: '#'
    },
    {
      name: 'Portfolio Website',
      description: 'Responsive portfolio website with smooth animations',
      tech: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
      link: '#'
    }
  ]);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
