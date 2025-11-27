import { BookOpen, Droplet, AlertCircle, Activity, Flame, Heart, Target } from 'lucide-react';

export function Education() {
  const topics = [
    {
      id: 'hydration',
      title: 'Hydration',
      icon: Droplet,
      description: 'Learn about proper hydration while on GLP-1 medication',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'nausea',
      title: 'Managing Nausea',
      icon: AlertCircle,
      description: 'Tips for handling nausea and vomiting',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      id: 'digestion',
      title: 'Digestive Health',
      icon: Activity,
      description: 'Understanding digestive changes and management',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'reflux',
      title: 'Heartburn & Reflux',
      icon: Flame,
      description: 'Managing reflux and indigestion symptoms',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      id: 'health',
      title: 'Overall Health',
      icon: Heart,
      description: 'Supporting your health journey',
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      id: 'goals',
      title: 'Goal Setting',
      icon: Target,
      description: 'Creating and achieving your health goals',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section className="py-6">
      <div className="mb-6">
        <h2 className="text-[#465E5A]">Education & Resources</h2>
        <p className="text-[#465E5A]/70 text-sm mt-1">
          Learn about GLP-1 medication and healthy living
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(topic => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              className="bg-white border border-[#465E5A]/15 p-6 rounded-lg text-left hover:shadow-lg hover:border-[#6264A1] transition-all"
            >
              <div className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${topic.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-[#465E5A] mb-2">{topic.title}</h3>
              <p className="text-sm text-[#465E5A]/70">{topic.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-white border border-[#465E5A]/15 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#9697C0]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-[#6264A1]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#465E5A] mb-2">Educational Resources</h3>
            <p className="text-[#465E5A]/70 mb-4">
              Access comprehensive guides, articles, and videos about GLP-1 medication,
              nutrition, and lifestyle management. Our content is created by healthcare
              professionals to support your journey.
            </p>
            <button className="px-4 py-2 bg-[#6264A1] text-white rounded-lg hover:bg-[#465E5A] transition-colors">
              Browse All Resources
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
