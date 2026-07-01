import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'

export type HeaderView = 'dashboard' | 'learn' | 'tabletop' | 'interactive-game'

interface Props {
  activeView?: HeaderView
  onNavigate: (view: HeaderView) => void
}

export default function Header({ activeView, onNavigate }: Props) {
  return (
    <header className="bg-canvas text-ink h-16 flex items-center px-6 justify-between no-print sticky top-0 z-20" style={{ borderBottom: '1px solid rgba(157, 142, 130, 0.25)' }}>
      <button
        onClick={() => onNavigate('dashboard')}
        className="font-display font-semibold text-xl text-ink tracking-tight cursor-pointer"
      >
        RansomReady
      </button>

      <nav className="flex items-center gap-6 text-sm">
        <button
          onClick={() => onNavigate('dashboard')}
          className={
            activeView === 'dashboard'
              ? 'text-safe font-semibold cursor-pointer'
              : 'text-ink-muted hover:text-ink transition-colors cursor-pointer'
          }
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('learn')}
          className={
            activeView === 'learn'
              ? 'text-safe font-semibold cursor-pointer'
              : 'text-ink-muted hover:text-ink transition-colors cursor-pointer'
          }
        >
          Learn
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={
              activeView === 'tabletop' || activeView === 'interactive-game'
                ? 'flex items-center gap-1 text-safe font-semibold transition-colors outline-none cursor-pointer'
                : 'flex items-center gap-1 text-ink-muted hover:text-ink transition-colors outline-none cursor-pointer'
            }
          >
            Practise
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            <DropdownMenuItem className="cursor-pointer" onClick={() => onNavigate('tabletop')}>
              Tabletop Exercises
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onNavigate('interactive-game')}
            >
              Interactive Game (Adventures)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-safe cursor-pointer">
          <Avatar>
            <AvatarFallback className="bg-surface text-ink">UR</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Manage Account</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
