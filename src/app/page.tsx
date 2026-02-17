import Image from "next/image";
import { Mail, Github, Linkedin, MapPin, ExternalLink } from "lucide-react";

export default function Home() {
  const skills = [
    "React", "Next.js", "TypeScript", "Vue.js",
    "Node.js", "Tailwind CSS", "GraphQL", "Git"
  ];

  const projects = [
    {
      name: "E-commerce Platform",
      description: "A full-stack e-commerce platform built with Next.js and Node.js",
      tech: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
      link: "#"
    },
    {
      name: "Task Management App",
      description: "Collaborative task management tool with real-time updates",
      tech: ["React", "Firebase", "Tailwind CSS"],
      link: "#"
    },
    {
      name: "Portfolio Website",
      description: "Responsive portfolio website with smooth animations",
      tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header / Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-blue-500/20">
              <Image
                src="/avatar.jpg"
                alt="王宇亮"
                width={160}
                height={160}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              王宇亮
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-medium mb-4">
              前端开发工程师
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-gray-600 mb-6">
              <MapPin className="w-4 h-4" />
              <span>求职意向：杭州、上海</span>
            </div>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Github className="w-5 h-5 text-gray-700" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-700" />
              </a>
              <a href="mailto:hello@example.com"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Mail className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
          关于我
        </h2>
        <div className="max-w-3xl text-gray-600 leading-relaxed text-lg">
          <p>
            大家好，我是一名热爱技术的前端开发工程师，拥有 3 年的 Web 开发经验。
            专注于构建高质量、高性能的用户界面，熟练掌握 Vue、React、Next.js 等主流前端框架。
            我热衷于学习新技术，追求代码优雅，致力于为用户带来最佳的使用体验。
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
          技能
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
          项目经验
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                查看项目 <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
          联系我
        </h2>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <p className="text-lg mb-6 opacity-90">
            如果你对我的工作感兴趣，或者有任何问题想要讨论，欢迎随时联系我！
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            发送邮件
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} 王宇亮. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
