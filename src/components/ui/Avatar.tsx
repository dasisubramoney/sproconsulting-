import { initials, type TeamMember } from '@/content/team';

interface AvatarProps {
  member: TeamMember;
  size?: 'md' | 'lg';
}

/** Consented photo if supplied, otherwise an initials tile with a copper sweep in the corner. */
export function Avatar({ member, size = 'md' }: AvatarProps) {
  const box = size === 'lg' ? 'h-40 w-40 text-4xl' : 'aspect-square w-full text-3xl';

  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={`${member.name}, ${member.role}`}
        width={480}
        height={480}
        loading="lazy"
        decoding="async"
        className={`${box} object-cover`}
      />
    );
  }

  return (
    <div className={`relative flex ${box} items-center justify-center overflow-hidden bg-ink`} aria-hidden="true">
      <span className="font-bold tracking-wide text-white">{initials(member.name)}</span>
      {/* Copper ribbon arc with a steel construction arc inside it, after the logo. */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full fill-none">
        <path d="M58 104 C 66 80 84 66 104 60" className="stroke-copper-500" strokeWidth="9" />
        <path d="M44 104 C 54 74 76 56 104 48" className="stroke-steel-500" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
