import { api } from "@/lib/api";
import { SkillNode } from "@/components/SkillNode";
import { DailyGoal } from "@/components/DailyGoal";

const ALIGN_CYCLE: Array<"left" | "center" | "right"> = ["center", "left", "right", "left"];

export default async function PathPage() {
  const [course, user] = await Promise.all([api.getPath(), api.getMe()]);

  let skillIndex = 0;

  return (
    <div>
      <DailyGoal currentXp={user.daily_xp_earned} goalXp={user.daily_xp_goal} />
      {course.units.map((unit) => (
        <div key={unit.id} className="mb-10">
          <div className="mb-8 rounded-2xl bg-duo-blue px-4 py-3 text-center font-extrabold text-white shadow-md">
            {unit.title}
          </div>
          <div className="flex flex-col items-center gap-8">
            {unit.skills.map((skill) => {
              const align = ALIGN_CYCLE[skillIndex % ALIGN_CYCLE.length];
              skillIndex++;
              return (
                <SkillNode key={skill.id} skill={skill} lessonId={skill.first_lesson_id} align={align} />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}