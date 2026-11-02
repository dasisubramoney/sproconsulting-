import { initials, type TeamMember } from '@/content/team';

interface AvatarProps {
  member: TeamMember;
  size?: 'md' | 'lg';
}

/** Consented photo if supplied, otherwise an initials tile with the slash motif. */
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
    <div className={`relative flex ${box} items-center justify-center overflow-hidden bg-navy`} aria-hidden="true">
      <span className="font-bold tracking-wide text-white">{initials(member.name)}</span>
      <span className="absolute -bottom-2 -right-8 h-4 w-28 -rotate-[22deg] bg-crimson" />
      <span className="absolute -bottom-7 -right-8 h-4 w-28 -rotate-[22deg] bg-maroon" />
    </div>
  );
}
