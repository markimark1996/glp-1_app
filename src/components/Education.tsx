import { useState } from 'react';
import { Book, Droplet, AlertCircle, Activity, Heart, Target, Flame, Dumbbell, UtensilsCrossed, Moon, Brain } from 'lucide-react';

type EducationTopic = 'hydration' | 'nausea' | 'diarrhoea' | 'constipation' | 'reflux' | 'health-support' | 'goal-setting';

export function Education() {
  const [activeTopic, setActiveTopic] = useState<EducationTopic>('hydration');
  const [glassesTracked, setGlassesTracked] = useState<boolean[]>(new Array(10).fill(false));

  const topics = [
    { id: 'hydration' as EducationTopic, label: 'Hydration', icon: Droplet },
    { id: 'nausea' as EducationTopic, label: 'Nausea & Vomiting', icon: AlertCircle },
    { id: 'diarrhoea' as EducationTopic, label: 'Diarrhoea', icon: Activity },
    { id: 'constipation' as EducationTopic, label: 'Constipation', icon: Activity },
    { id: 'reflux' as EducationTopic, label: 'Reflux, Heartburn & Indigestion', icon: Flame },
    { id: 'health-support' as EducationTopic, label: 'Health Support', icon: Heart },
    { id: 'goal-setting' as EducationTopic, label: 'Goal Setting', icon: Target },
  ];

  const toggleGlass = (index: number) => {
    const newGlasses = [...glassesTracked];
    newGlasses[index] = !newGlasses[index];
    setGlassesTracked(newGlasses);
  };

  return (
    <section className="py-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#6264A1] text-white flex items-center justify-center mx-auto mb-4">
          <Book className="w-8 h-8" />
        </div>
        <h2 className="text-[#465E5A] mb-2">Health Education Hub</h2>
        <p className="text-[#465E5A]/70 text-sm max-w-2xl mx-auto">
          Comprehensive guidance and support for your health journey with evidence-based information and practical tips.
        </p>
      </div>

      <div className="bg-white border border-[#465E5A]/15 p-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                  activeTopic === topic.id
                    ? 'bg-[#465E5A] text-white'
                    : 'bg-[#EEEBE7] text-[#465E5A] hover:bg-[#E5F2E4]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTopic === 'hydration' && <HydrationContent glassesTracked={glassesTracked} onToggleGlass={toggleGlass} />}
      {activeTopic === 'nausea' && <NauseaContent />}
      {activeTopic === 'diarrhoea' && <DiarrhoeaContent />}
      {activeTopic === 'constipation' && <ConstipationContent />}
      {activeTopic === 'reflux' && <RefluxContent />}
      {activeTopic === 'health-support' && <HealthSupportContent />}
      {activeTopic === 'goal-setting' && <GoalSettingContent />}
    </section>
  );
}

function HydrationContent({ glassesTracked, onToggleGlass }: { glassesTracked: boolean[], onToggleGlass: (index: number) => void }) {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <Droplet className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Stay Hydrated, Stay Healthy</h3>
        <p className="text-[#465E5A]/70 text-sm max-w-2xl mx-auto">
          If you're on a GLP-1 medication, staying well-hydrated is one of the kindest things you can do for your body right now.
        </p>
      </div>

      <div className="p-8 space-y-4 border-b border-[#465E5A]/15">
        <p className="text-[#465E5A]">
          Aim for about <strong>2–3 litres of fluids a day</strong>—that's roughly 10 average glasses of water. It might sound like a lot, but spreading it out over the day makes it much more manageable.
        </p>

        <p className="text-[#465E5A]">
          The best choice? <strong>Plain water is always a winner</strong>, but <strong>unsweetened tea or coffee</strong> can be great too. If you're looking to mix things up, <strong>nutrient-rich options like low-fat milk or soy milk</strong>, are also fantastic for giving your body a little extra nourishment while keeping you hydrated.
        </p>

        <p className="text-[#465E5A]">
          Try to go easy on sugary drinks, alcohol or too much caffeine. And if you're after something soothing and gentle, <strong>herbal teas</strong> (think peppermint, ginger) are lovely and comforting choices.
        </p>

        <p className="text-[#465E5A]">
          <strong>Small daily habits like this really add up, and your body will thank you. You've got this!</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-[#465E5A]/15">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-3">
            <Droplet className="w-6 h-6" />
          </div>
          <h4 className="text-[#465E5A] mb-3">Best Choices</h4>
          <ul className="space-y-2 text-sm text-[#465E5A]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#6264A1] mt-0.5">•</span>
              <span>Plain water</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6264A1] mt-0.5">•</span>
              <span>Unsweetened tea</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6264A1] mt-0.5">•</span>
              <span>Unsweetened coffee</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-[#DDEFDC]/50 text-[#465E5A] flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="text-[#465E5A] mb-3">Nutrient-Rich Options</h4>
          <ul className="space-y-2 text-sm text-[#465E5A]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#6264A1] mt-0.5">•</span>
              <span>Low-fat milk</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6264A1] mt-0.5">•</span>
              <span>Soy milk</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6264A1] mt-0.5">•</span>
              <span>Herbal teas</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-[#E3DBD1]/50 text-[#465E5A] flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-[#465E5A] mb-3">Go Easy On</h4>
          <ul className="space-y-2 text-sm text-[#465E5A]/70">
            <li className="flex items-start gap-2">
              <span className="text-[#465E5A]/50 mt-0.5">⚠</span>
              <span>Sugary drinks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#465E5A]/50 mt-0.5">⚠</span>
              <span>Alcohol</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#465E5A]/50 mt-0.5">⚠</span>
              <span>Too much caffeine</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-8 bg-[#F4F6F7]">
        <div className="text-center mb-6">
          <h4 className="text-[#465E5A] mb-2">Your Daily Goal</h4>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-[#6264A1] numeric" style={{ fontSize: '2rem', fontWeight: 500 }}>2-3</span>
            <span className="text-[#465E5A] text-sm">litres per day</span>
          </div>
          <p className="text-xs text-[#465E5A]/70">That's about 10 glasses spread throughout your day</p>
        </div>

        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {glassesTracked.map((filled, index) => (
            <button
              key={index}
              onClick={() => onToggleGlass(index)}
              className={`w-10 h-10 border-2 transition-all ${
                filled
                  ? 'bg-[#6264A1] border-[#6264A1]'
                  : 'bg-white border-[#465E5A]/20 hover:border-[#6264A1]'
              }`}
              aria-label={`Glass ${index + 1}`}
            />
          ))}
        </div>

        <p className="text-center text-xs text-[#465E5A]/60">Track your daily progress!</p>
      </div>
    </div>
  );
}

function NauseaContent() {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Managing Nausea & Vomiting on GLP-1 Treatment</h3>
      </div>

      <div className="p-8 bg-[#F8F9FA] border-b border-[#465E5A]/15">
        <div className="max-w-4xl mx-auto space-y-4 text-sm text-[#465E5A]">
          <p className="leading-relaxed">
            Side effects are a common and completely normal response to GLP-1 treatment and may change over time. You don't need to suffer in silence - below are dietary tips, thoughtful suggestions and coping strategies that we hope will help. If side effects persist or you experience signs of dehydration despite the below strategies, seek guidance from your healthcare professional, who can recommend medications such as anti-nausea drugs to help you manage them further.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-4 border-b border-[#465E5A]/15">
        <p className="text-[#465E5A]">
          Feeling sick (nausea) or vomiting is a common side effect when starting GLP-1 medications or increasing your dose. Nausea and vomiting usually improves over time as your body adjusts.
        </p>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15">
        <h4 className="text-[#465E5A] mb-6">Tips for eating when you feel sick:</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-[#465E5A] mb-4">Eating Patterns</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Try not to skip meals, as an empty stomach may worsen symptoms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>For a small breakfast, followed by small meals at least every 3–4 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Eat slowly - take your time eating meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Stay hydrated - sip on water throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Try ginger tea or peppermint tea</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Choose plain foods such as plain soups, bananas, scrambled eggs on toast, potatoes, pasta or rice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Try sharp tasting fluids like fruit or a tangy yoghurt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Include a source of protein with each meal (e.g. plain chicken, yoghurt, eggs, tofu)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Cold or room temperature foods may be easier to tolerate (e.g. sandwiches, salads, yoghurt)</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#465E5A] mb-4">Avoid</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">•</span>
                <span>Very sweet, spicy, fatty, or fried foods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">•</span>
                <span>High-fibre foods during the first few days of treatment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">•</span>
                <span>Strong smelling foods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">•</span>
                <span>Alcohol and caffeine</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15">
        <h4 className="text-[#465E5A] mb-4">Practical tips</h4>
        <ul className="space-y-3 text-sm text-[#465E5A]/80 max-w-3xl">
          <li className="flex items-start gap-2">
            <span className="text-[#6264A1] mt-1">•</span>
            <span>Rest upright after eating; avoid lying down for at least 60 minutes after a meal</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6264A1] mt-1">•</span>
            <span>Go for a short walk or get some fresh air after meals</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6264A1] mt-1">•</span>
            <span>Wear loose fitting clothing, especially around the waist</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6264A1] mt-1">•</span>
            <span>Practise gentle relaxation techniques, like meditation or mindfulness</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6264A1] mt-1">•</span>
            <span>Consider using an acupressure (anti-nausea) band</span>
          </li>
        </ul>
      </div>

      <div className="p-8 bg-[#F8F9FA]">
        <p className="text-sm text-[#465E5A]/80 text-center max-w-3xl mx-auto mb-6">
          These simple food and lifestyle strategies can often ease nausea and vomiting whilst ensuring you keep your body well nourished.
        </p>

        <div className="border-t border-[#465E5A]/15 pt-6 mt-6">
          <h5 className="text-[#465E5A] text-sm mb-3">Sources:</h5>
          <div className="space-y-1 text-xs text-[#465E5A]/60">
            <p>NHS: https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/vomiting-and-morning-sickness/</p>
            <p>BMJ: Managing Nausea and Vomiting</p>
            <p>Musunuru et al., Obesity (Silver Spring). 2023;1-23</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiarrhoeaContent() {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Managing Diarrhoea on GLP-1 Treatment</h3>
      </div>

      <div className="p-8 bg-[#F8F9FA] border-b border-[#465E5A]/15">
        <div className="max-w-4xl mx-auto space-y-4 text-sm text-[#465E5A]">
          <p className="leading-relaxed">
            Side effects are a common and completely normal response to GLP-1 treatment and may change over time. You don't need to suffer in silence - below are dietary tips, thoughtful suggestions and coping strategies that we hope will help. If side effects persist or you experience signs of dehydration despite the below strategies, seek guidance from your healthcare professional, who can recommend medications such as anti-diarrhoea drugs to help you manage them further.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-4 border-b border-[#465E5A]/15">
        <p className="text-[#465E5A]">
          Diarrhoea can be a side effect of GLP-1 treatment, leading to loose or watery bowel movements. While a high fibre diet is generally recommended for bowel health, if you are experiencing diarrhoea, it may be helpful to temporarily reduce your fibre intake. A lower fibre diet can support recovery. Diarrhoea related fluid loss, so it's important to drink plenty of fluids to prevent dehydration.
        </p>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15">
        <h4 className="text-[#465E5A] mb-6">Tips for Managing Diarrhoea</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-[#465E5A] mb-4">Eating Patterns</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Eat small, frequent meals every 3–4 hours, rather than large meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Include meals with a higher water content (like soups or stews) to support hydration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Stay hydrated - sip on water throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Consider fluids with a higher water content (like soups or stews) to support hydration</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#465E5A] mb-4">Foods to Avoid</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Products high in sugar, alcohol, or sorbitol - found in artificial sweeteners, sugar-free chewing gum, "diabetic" or reduced calorie products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Temporarily avoid high-fibre foods: wholegrain breads, brown rice, beans, lentils, seeds, nuts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Raw vegetable and raw fruits with skins or seeds (e.g. raisins nuts)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Very fatty, fatty or fried foods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Alcohol and caffeine, which can worsen diarrhoea</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15">
        <h4 className="text-[#465E5A] mb-6">Choose Gentle, Lower-Fibre Foods</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-[#465E5A] mb-4">Good Options</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>White bread</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Peeled potatoes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Plain chicken, white fish, tofu, or eggs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Smooth yoghurt, oatmeal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Cooked, peeled fruits and vegetables (e.g. stewed apples or cooked carrots)</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#465E5A] mb-4">Soluble Fibre Sources</h5>
            <p className="text-xs text-[#465E5A]/70 mb-4 leading-relaxed">
              While insoluble fibre may aggravate diarrhoea, soluble fibre can help by absorbing water and adding bulk to stools:
            </p>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Oats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Banana</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Peeled apples (stewed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Potatoes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Soluble fibre supplements such as psyllium husk (available in pharmacies)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15 bg-[#F8F9FA]">
        <h4 className="text-[#465E5A] mb-4">Recovery</h4>
        <p className="text-sm text-[#465E5A]/80 leading-relaxed">
          When symptoms improve, gradually reintroduce higher-fibre foods (e.g. wholegrains, all fruits, and vegetables) to support long-term gut health.
        </p>
      </div>

      <div className="p-8 bg-[#F8F9FA]">
        <h5 className="text-[#465E5A] text-sm mb-3">Sources:</h5>
        <div className="space-y-1 text-xs text-[#465E5A]/60">
          <p>Mazahreh et al., Obesity (Silver Spring). 2024;1-29</p>
          <p>NHS: https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/diarrhoea-and-vomiting/</p>
          <p>WHO: Diarrhoea</p>
        </div>
      </div>
    </div>
  );
}

function ConstipationContent() {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Managing Constipation on GLP-1 Treatment</h3>
      </div>

      <div className="p-8 bg-[#F8F9FA] border-b border-[#465E5A]/15">
        <div className="max-w-4xl mx-auto space-y-4 text-sm text-[#465E5A]">
          <p className="leading-relaxed">
            Side effects are a common and completely normal response to GLP-1 treatment and may change over time. You don't need to suffer in silence - below are dietary tips, thoughtful suggestions and coping strategies that we hope will help. If side effects persist or you experience signs of dehydration despite the below strategies, seek guidance from your healthcare professional, who can recommend medications such as laxatives or stool softeners to help you manage them further.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-4 border-b border-[#465E5A]/15">
        <p className="text-[#465E5A]">
          Constipation is a common side effect of GLP-1 medication. These medications can slow down how fast food moves through your stomach - which can leave you feeling 'backed up'. If this is the case it could be useful to focus on eating nutrient-dense foods to help with bowel movements — this is the opposite of what you might do with diarrhoea, and it's described by your gut and bowels.
        </p>
        <p className="text-[#465E5A]">
          Instead fibre should usually be at the centre of a healthy diet for gut health. Fibre absorbs water and makes stools easier to pass, reducing the risk of constipation.
        </p>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15">
        <h4 className="text-[#465E5A] mb-6">Tips to Ease Constipation on GLP-1s</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-[#465E5A] mb-4">Include more fibre-rich foods:</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Choose wholemeal bread and wholegrain breakfast cereals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Go for brown rice or wholegrain pasta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Include vegetables at most meals, and with main meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Add legumes/pulses (e.g. chickpeas, beans) or seeds to salads & soups or as a side dish</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Keep the skins on potatoes — try with sweet potatoes, too</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Eat whole pieces of fruit, but raw veggies or fruits with skins or seeds (e.g. berries, kiwi fruit, figs) may be more helpful than juices or fruit blends.</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#465E5A] mb-4">Support regular digestion:</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Eat regular meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Take time to eat and enjoy your meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Use a toilet or squatting position or wearing a shh Step. Try not to routinely skip bowel movements.</span>
              </li>
            </ul>

            <h5 className="text-[#465E5A] mb-4 mt-6">Stay Active and Hydrated:</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Aim for 30 minutes of physical activity most days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Drink plenty of fluids - about 2–3 litres per day</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#F8F9FA]">
        <p className="text-sm text-[#465E5A]/80 text-center max-w-3xl mx-auto mb-6">
          If constipation persists, speak to your healthcare professional, who may recommend fibre supplements or medications.
        </p>

        <div className="border-t border-[#465E5A]/15 pt-6 mt-6">
          <h5 className="text-[#465E5A] text-sm mb-3">Sources:</h5>
          <div className="space-y-1 text-xs text-[#465E5A]/60">
            <p>NHS: https://www.nhs.uk/conditions/constipation/</p>
            <p>BMJ: Constipation in Adults</p>
            <p>Mazahreh et al., Obesity (Silver Spring). 2024;1-29</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefluxContent() {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <Flame className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Managing Reflux, Heartburn & Indigestion</h3>
      </div>

      <div className="p-8 bg-[#F8F9FA] border-b border-[#465E5A]/15">
        <div className="max-w-4xl mx-auto space-y-4 text-sm text-[#465E5A]">
          <p className="leading-relaxed">
            Side effects are a common and completely normal response to GLP-1 treatment and may change over time. You don't need to suffer in silence - below are dietary tips, thoughtful suggestions and coping strategies that we hope will help. If side effects persist despite the below strategies, seek guidance from your healthcare professional, who can recommend medications such as antacids to help you manage them further.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-4 border-b border-[#465E5A]/15">
        <p className="text-[#465E5A]">
          Acid reflux (heartburn or indigestion) happens when stomach acid rises into the oesophagus, causing discomfort. GLP-1 medications can slow stomach emptying, which may worsen these symptoms.
        </p>
      </div>

      <div className="p-8 border-b border-[#465E5A]/15">
        <h4 className="text-[#465E5A] mb-6">Tips to Reduce Reflux & Heartburn</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-[#465E5A] mb-4">Eating Habits</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Eat small, frequent meals instead of large meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Avoid eating 3–4 hours before bed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Eat slowly and chew food thoroughly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Stay upright for at least 60 minutes after eating</span>
              </li>
            </ul>

            <h5 className="text-[#465E5A] mb-4 mt-6">Lifestyle Changes</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Raise the head of your bed by 15–20cm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Wear loose clothing around the waist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Manage stress through relaxation techniques</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#465E5A] mb-4">Foods to Avoid</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Spicy, fatty, or fried foods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Chocolate, peppermint, and tomatoes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Citrus fruits and juices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Alcohol and caffeine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#465E5A]/50 mt-1">⚠</span>
                <span>Carbonated drinks</span>
              </li>
            </ul>

            <h5 className="text-[#465E5A] mb-4 mt-6">Good Options</h5>
            <ul className="space-y-3 text-sm text-[#465E5A]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Lean proteins (chicken, fish, tofu)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Whole grains (oatmeal, brown rice)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Non-citrus fruits (bananas, melons)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6264A1] mt-1">•</span>
                <span>Vegetables (especially leafy greens)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#F8F9FA]">
        <p className="text-sm text-[#465E5A]/80 text-center max-w-3xl mx-auto mb-6">
          If symptoms persist, your healthcare professional may recommend antacids or other medications to help manage reflux.
        </p>

        <div className="border-t border-[#465E5A]/15 pt-6 mt-6">
          <h5 className="text-[#465E5A] text-sm mb-3">Sources:</h5>
          <div className="space-y-1 text-xs text-[#465E5A]/60">
            <p>NHS: https://www.nhs.uk/conditions/heartburn-and-acid-reflux/</p>
            <p>BMJ: Gastro-oesophageal Reflux Disease</p>
            <p>Musunuru et al., Obesity (Silver Spring). 2023;1-23</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthSupportContent() {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Supporting Your Overall Health</h3>
        <p className="text-[#465E5A]/70 text-sm max-w-2xl mx-auto">
          Beyond managing side effects, these strategies support your long-term health and wellbeing.
        </p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-[#F8F9FA]">
            <div className="w-12 h-12 bg-[#DDEFDC]/50 text-[#465E5A] flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h4 className="text-[#465E5A] mb-3">Balanced Nutrition</h4>
            <p className="text-sm text-[#465E5A]/70 leading-relaxed">
              Focus on nutrient-dense whole foods including lean proteins, whole grains, fruits, vegetables, and healthy fats.
            </p>
          </div>

          <div className="text-center p-6 bg-[#F8F9FA]">
            <div className="w-12 h-12 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h4 className="text-[#465E5A] mb-3">Physical Activity</h4>
            <p className="text-sm text-[#465E5A]/70 leading-relaxed">
              Aim for 150 minutes of moderate activity per week. Start small and gradually increase as you feel comfortable.
            </p>
          </div>

          <div className="text-center p-6 bg-[#F8F9FA]">
            <div className="w-12 h-12 bg-[#E3DBD1]/50 text-[#465E5A] flex items-center justify-center mx-auto mb-4">
              <Moon className="w-6 h-6" />
            </div>
            <h4 className="text-[#465E5A] mb-3">Quality Sleep</h4>
            <p className="text-sm text-[#465E5A]/70 leading-relaxed">
              Prioritize 7-9 hours of quality sleep. Good sleep supports metabolism, mood, and overall health.
            </p>
          </div>
        </div>

        <div className="border-t border-[#465E5A]/15 pt-8">
          <h4 className="text-[#465E5A] mb-6 text-center">Key Health Pillars</h4>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#6264A1]/10 text-[#6264A1] flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[#465E5A] mb-2">Mental Wellbeing</h5>
                  <p className="text-sm text-[#465E5A]/70 leading-relaxed">
                    Practice stress management through mindfulness, meditation, or activities you enjoy. Don't hesitate to seek support from mental health professionals when needed.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#6264A1]/10 text-[#6264A1] flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[#465E5A] mb-2">Regular Health Checks</h5>
                  <p className="text-sm text-[#465E5A]/70 leading-relaxed">
                    Stay connected with your healthcare team. Regular check-ins help monitor progress and adjust your treatment plan as needed.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[#6264A1]/10 text-[#6264A1] flex items-center justify-center flex-shrink-0 mt-1">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[#465E5A] mb-2">Consistent Hydration</h5>
                  <p className="text-sm text-[#465E5A]/70 leading-relaxed">
                    Maintain proper hydration throughout the day. Water supports every system in your body and is especially important during GLP-1 treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#F8F9FA] border-t border-[#465E5A]/15">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#465E5A]/80 leading-relaxed mb-4">
            Remember, your health journey is unique to you. These guidelines provide a foundation, but always consult with your healthcare professional for personalized advice.
          </p>
          <p className="text-xs text-[#465E5A]/60">
            Your wellbeing matters. Take it one day at a time, and celebrate small victories along the way.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoalSettingContent() {
  return (
    <div className="bg-white border border-[#465E5A]/15">
      <div className="text-center p-8 border-b border-[#465E5A]/15">
        <div className="w-16 h-16 bg-[#C5DFF2]/50 text-[#6264A1] flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-[#465E5A] mb-2">Setting & Achieving Your Health Goals</h3>
        <p className="text-[#465E5A]/70 text-sm max-w-2xl mx-auto">
          Create meaningful goals that support your health journey and celebrate your progress.
        </p>
      </div>

      <div className="p-8 space-y-8">
        <div>
          <h4 className="text-[#465E5A] mb-4">SMART Goal Framework</h4>
          <p className="text-sm text-[#465E5A]/70 mb-6 leading-relaxed">
            Set goals that are Specific, Measurable, Achievable, Relevant, and Time-bound to increase your chances of success.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-[#F8F9FA]">
              <h5 className="text-[#465E5A] text-sm mb-2">Specific</h5>
              <p className="text-xs text-[#465E5A]/70">Clear and well-defined</p>
            </div>
            <div className="p-4 bg-[#F8F9FA]">
              <h5 className="text-[#465E5A] text-sm mb-2">Measurable</h5>
              <p className="text-xs text-[#465E5A]/70">Track your progress</p>
            </div>
            <div className="p-4 bg-[#F8F9FA]">
              <h5 className="text-[#465E5A] text-sm mb-2">Achievable</h5>
              <p className="text-xs text-[#465E5A]/70">Realistic and attainable</p>
            </div>
            <div className="p-4 bg-[#F8F9FA]">
              <h5 className="text-[#465E5A] text-sm mb-2">Relevant</h5>
              <p className="text-xs text-[#465E5A]/70">Meaningful to you</p>
            </div>
            <div className="p-4 bg-[#F8F9FA]">
              <h5 className="text-[#465E5A] text-sm mb-2">Time-bound</h5>
              <p className="text-xs text-[#465E5A]/70">Has a deadline</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#465E5A]/15 pt-8">
          <h4 className="text-[#465E5A] mb-6">Example Goals</h4>

          <div className="space-y-4">
            <div className="p-4 bg-[#DDEFDC]/30 border-l-4 border-[#6264A1]">
              <h5 className="text-[#465E5A] text-sm mb-2">Nutrition Goal</h5>
              <p className="text-sm text-[#465E5A]/80">
                "I will include at least 3 servings of vegetables in my meals each day for the next 4 weeks."
              </p>
            </div>

            <div className="p-4 bg-[#C5DFF2]/30 border-l-4 border-[#6264A1]">
              <h5 className="text-[#465E5A] text-sm mb-2">Activity Goal</h5>
              <p className="text-sm text-[#465E5A]/80">
                "I will walk for 20 minutes, 5 days a week, for the next month."
              </p>
            </div>

            <div className="p-4 bg-[#E3DBD1]/30 border-l-4 border-[#6264A1]">
              <h5 className="text-[#465E5A] text-sm mb-2">Hydration Goal</h5>
              <p className="text-sm text-[#465E5A]/80">
                "I will drink 8 glasses of water daily and track my intake for 3 weeks."
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#465E5A]/15 pt-8">
          <h4 className="text-[#465E5A] mb-6">Tips for Success</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-3 text-sm text-[#465E5A]/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Start small - choose one or two goals to focus on initially</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Write your goals down and place them somewhere visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Track your progress regularly using a journal or app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Celebrate small wins along the way</span>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-3 text-sm text-[#465E5A]/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Share your goals with supportive friends or family</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Be flexible - adjust goals as needed based on your progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Focus on progress, not perfection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6264A1] mt-1">•</span>
                  <span>Review and reflect on your goals weekly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#F8F9FA] border-t border-[#465E5A]/15">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#465E5A]/80 leading-relaxed mb-4">
            Remember, every journey begins with a single step. Your goals should inspire and motivate you, not overwhelm you. Start where you are, use what you have, and do what you can.
          </p>
          <p className="text-xs text-[#465E5A]/60 italic">
            "The secret of getting ahead is getting started." - Mark Twain
          </p>
        </div>
      </div>
    </div>
  );
}
