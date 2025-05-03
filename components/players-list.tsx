'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { addPlayerToTeam } from '@/state';
import { useAppSelector } from '@/app/redux';
import { useAppDispatch } from '@/app/redux';

const api = new BalldontlieAPI({
  apiKey: process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY || '',
});

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string | null;
  country: string | null;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: {
    id: number;
    conference: string;
    division: string;
    city: string;
    name: string;
    full_name: string;
    abbreviation: string;
  };
}

export default function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined
  );
  const [playersInTeams, setPlayersInTeams] = useState<number[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPlayerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Fetch teams from the Redux store
  const teams = useAppSelector((state) => state.teams.teams);

  const fetchPlayers = async (cursor: number | null = null) => {
    try {
      const playersResponse = await api.nba.getPlayers({
        per_page: 10,
        cursor: cursor || undefined,
      });
      setPlayers((prevPlayers) =>
        cursor
          ? [...prevPlayers, ...playersResponse.data]
          : playersResponse.data
      );
      setNextCursor(playersResponse.meta?.next_cursor || null);
      setHasMore(playersResponse.meta?.next_cursor !== null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && nextCursor !== null) {
        fetchPlayers(nextCursor);
      }
    });

    if (lastPlayerRef.current) {
      observer.current.observe(lastPlayerRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, nextCursor]);

  const handleAddToTeam = (player: Player) => {
    if (!selectedTeam) {
      toast({
        title: 'Error',
        description: 'Please select a team first',
        variant: 'destructive',
      });
      return;
    }

    if (playersInTeams.includes(player.id)) {
      toast({
        title: 'Error',
        description: 'This player is already in a team',
        variant: 'destructive',
      });
      return;
    }

    dispatch(addPlayerToTeam({ teamId: selectedTeam, playerId: player.id }));
    setPlayersInTeams((prev) => [...prev, player.id]);

    toast({
      title: 'Success',
      description: `${player.first_name} ${player.last_name} added to team`,
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Players</h2>
        <div className='flex items-center gap-2'>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select a team' />
            </SelectTrigger>
            <SelectContent>
              {/* Map over the teams from the Redux store */}
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {players.map((player, index) => {
          const isLastPlayer = index === players.length - 1;
          const isInTeam = playersInTeams.includes(player.id);

          return (
            <div key={player.id} ref={isLastPlayer ? lastPlayerRef : null}>
              <Card>
                <CardHeader className='pb-2'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <CardTitle>{`${player.first_name} ${player.last_name}`}</CardTitle>
                      <CardDescription>
                        {player.position || 'Position not specified'}
                      </CardDescription>
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {player.first_name[0]}
                        {player.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex justify-between items-center'>
                    <Badge variant='outline'>{player.team.full_name}</Badge>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleAddToTeam(player)}
                      disabled={isInTeam || !selectedTeam}
                    >
                      {isInTeam ? (
                        <span className='text-xs'>Already in team</span>
                      ) : (
                        <>
                          <UserPlus className='h-4 w-4 mr-1' />
                          Add to team
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <div>
                    <Skeleton className='h-5 w-40 mb-2' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className='h-10 w-10 rounded-full' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-9 w-24' />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {hasMore && (
        <div className='flex justify-center mt-4'>
          <Button onClick={() => fetchPlayers(nextCursor)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {!hasMore && players.length > 0 && (
        <p className='text-center text-muted-foreground mt-4'>
          No more players to load
        </p>
      )}

      {!loading && players.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>No players found</p>
        </div>
      )}
    </div>
  );
}
