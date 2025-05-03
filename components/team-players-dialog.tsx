'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { useAppSelector } from '@/app/redux';
interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
}

interface TeamPlayersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  team: {
    id: string;
    name: string;
    players: Player[];
  };
  onRemovePlayer: (teamId: string, playerId: number) => void; // Callback for removing a player
}

export default function TeamPlayersDialog({
  isOpen,
  onClose,
  teamId,
  team,
  onRemovePlayer,
}: TeamPlayersDialogProps) {
  const { toast } = useToast();
  const teamPlayers = useAppSelector(
    (state) => state.teams.teamPlayers[teamId] || []
  );

  const handleRemovePlayer = (playerId: number) => {
    onRemovePlayer(teamId, playerId);
    toast({
      title: 'Player removed',
      description: 'The player has been removed from the team',
    });
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{team.name} - Players</DialogTitle>
          <DialogDescription>
            {teamPlayers.length > 0
              ? `Manage players in ${team.name}`
              : `No players in ${team.name} yet`}
          </DialogDescription>
        </DialogHeader>

        {teamPlayers.length === 0 ? (
          <div className='text-center py-6'>
            <p className='text-muted-foreground'>
              This team has no players. Add players from the Players tab.
            </p>
          </div>
        ) : (
          <div className='space-y-2 max-h-[300px] overflow-y-auto pr-2'>
            {teamPlayers.map((playerId) => (
              <div
                key={playerId}
                className='flex items-center justify-between p-3 border rounded-md'
              >
                <div className='flex items-center gap-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='text-xs'>
                      {playerId}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>Player {playerId}</p>
                    <p className='text-xs text-muted-foreground'>
                      Position • Team
                    </p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleRemovePlayer(playerId)}
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
