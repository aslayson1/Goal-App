'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/auth-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { ChevronLeft, Crown, TrendingUp, TrendingDown } from 'lucide-react'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [timeframe])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const now = new Date()
      let startDate = new Date()

      if (timeframe === 'week') {
        startDate.setDate(now.getDate() - 7)
      } else if (timeframe === 'month') {
        startDate.setMonth(now.getMonth() - 1)
      } else {
        startDate = new Date('2020-01-01')
      }

      console.log('[v0] Current user ID:', user?.id)
      console.log('[v0] Timeframe:', timeframe, 'Start date:', startDate.toISOString().split('T')[0])

      // Fetch agents
      const { data: agents } = await supabase
        .from('agents')
        .select('id, name, email, auth_user_id')
      console.log('[v0] Agents fetched:', agents)

      if (!agents) return

      // Get all unique auth_user_ids
      const authUserIds = agents
        .map(agent => agent.auth_user_id)
        .filter((id): id is string => !!id)

      // Fetch profiles for those auth_user_ids
      let profilesMap: Record<string, { avatar_url: string | null }> = {}
      if (authUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, avatar_url')
          .in('id', authUserIds)

        if (profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = { avatar_url: profile.avatar_url }
            return acc
          }, {} as Record<string, { avatar_url: string | null }>)
        }
      }

      // First, let's check all fitness logs to see what user_ids are in there
      const { data: allLogs } = await supabase
        .from('fitness_logs')
        .select('*')
        .gte('logged_date', startDate.toISOString().split('T')[0])
      console.log('[v0] All fitness logs in range:', allLogs)

      const leaderboardData = await Promise.all(
        agents.map(async (agent) => {
          const { count, data: agentLogs } = await supabase
            .from('fitness_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', agent.auth_user_id)
            .gte('logged_date', startDate.toISOString().split('T')[0])

          console.log(`[v0] Agent ${agent.name} (auth_user_id: ${agent.auth_user_id}): ${count} workouts`, agentLogs)

          return {
            id: agent.id,
            name: agent.name || agent.email?.split('@')[0] || 'Unknown',
            workouts: count || 0,
            isCurrentUser: agent.auth_user_id === user?.id,
            avatar_url: agent.auth_user_id ? (profilesMap[agent.auth_user_id]?.avatar_url || null) : null,
          }
        })
      )

      leaderboardData.sort((a, b) => b.workouts - a.workouts)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  const championColors = [
    { ring: 'ring-sky-400', bg: 'bg-sky-400', text: 'text-sky-600' },
    { ring: 'ring-amber-400', bg: 'bg-amber-400', text: 'text-amber-600' },
    { ring: 'ring-rose-400', bg: 'bg-rose-400', text: 'text-rose-600' },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* Thin green header strip */}
      <div className="bg-emerald-100 h-12" />

      {/* Main Content Card */}
      <div className="relative -mt-6 mx-6 mb-6 flex-1">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
          {/* Header with Back, Title, and Timeframe Toggle */}
          <div className="flex items-center justify-between gap-4 p-4 border-b">
            {/* Left side: Back button and Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/fitness"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Link>
              <h1 className="text-xl font-bold text-black">Leaderboard</h1>
            </div>

            {/* Right side: Timeframe Toggle */}
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeframe === tf
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tf === 'all' ? 'All Time' : tf === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-slate-500">Loading...</div>
            </div>
          ) : (
            <>
              {/* Top 3 Champions */}
              {top3.length >= 3 && (
                <div className="px-6 lg:px-12 py-8 lg:py-12">
                  <div className="flex items-end justify-center gap-8 lg:gap-16">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                      <Avatar className={`h-16 w-16 lg:h-24 lg:w-24 ring-4 ${championColors[0].ring}`}>
                        {top3[1]?.avatar_url && (
                          <AvatarImage src={top3[1].avatar_url} alt={top3[1]?.name} />
                        )}
                        <AvatarFallback className="bg-slate-100 text-slate-700 text-lg lg:text-2xl font-semibold">
                          {getInitials(top3[1]?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`mt-2 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full ${championColors[0].bg} text-white text-sm lg:text-base font-bold`}>
                        {top3[1]?.workouts}
                      </div>
                      <span className="mt-1 font-semibold text-slate-800 text-sm lg:text-base">
                        {top3[1]?.name?.split(' ')[0]}
                      </span>
                      <div className={`w-20 lg:w-28 h-3 mt-3 rounded-full ${championColors[0].bg}`} />
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center -mt-4 lg:-mt-8">
                      <Crown className="h-8 w-8 lg:h-12 lg:w-12 text-amber-400 mb-1" />
                      <Avatar className={`h-20 w-20 lg:h-28 lg:w-28 ring-4 ${championColors[1].ring}`}>
                        {top3[0]?.avatar_url && (
                          <AvatarImage src={top3[0].avatar_url} alt={top3[0]?.name} />
                        )}
                        <AvatarFallback className="bg-amber-50 text-amber-700 text-xl lg:text-3xl font-semibold">
                          {getInitials(top3[0]?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`mt-2 px-4 lg:px-5 py-1.5 lg:py-2 rounded-full ${championColors[1].bg} text-white text-sm lg:text-lg font-bold`}>
                        {top3[0]?.workouts}
                      </div>
                      <span className="mt-1 font-semibold text-slate-800 lg:text-lg">
                        {top3[0]?.name?.split(' ')[0]}
                      </span>
                      <div className={`w-24 lg:w-36 h-3 lg:h-4 mt-3 rounded-full ${championColors[1].bg}`} />
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                      <Avatar className={`h-16 w-16 lg:h-24 lg:w-24 ring-4 ${championColors[2].ring}`}>
                        {top3[2]?.avatar_url && (
                          <AvatarImage src={top3[2].avatar_url} alt={top3[2]?.name} />
                        )}
                        <AvatarFallback className="bg-rose-50 text-rose-700 text-lg lg:text-2xl font-semibold">
                          {getInitials(top3[2]?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`mt-2 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full ${championColors[2].bg} text-white text-sm lg:text-base font-bold`}>
                        {top3[2]?.workouts}
                      </div>
                      <span className="mt-1 font-semibold text-slate-800 text-sm lg:text-base">
                        {top3[2]?.name?.split(' ')[0]}
                      </span>
                      <div className={`w-20 lg:w-28 h-3 mt-3 rounded-full ${championColors[2].bg}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* Rankings List */}
              <div className="border-t">
                <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 text-lg">All Rankings</h2>
                </div>

                {/* Table Header */}
                <div className="px-6 lg:px-8 py-3 grid grid-cols-12 gap-4 text-xs lg:text-sm text-slate-500 font-medium border-b bg-slate-50">
                  <div className="col-span-5 lg:col-span-4">Name</div>
                  <div className="col-span-2 lg:col-span-2 text-center">Score</div>
                  <div className="col-span-2 lg:col-span-2 text-center">Rank</div>
                  <div className="col-span-3 lg:col-span-4 text-center">Workouts</div>
                </div>

                {/* Rankings */}
                <div className="divide-y">
                  {leaderboard.map((person, index) => (
                    <div
                      key={person.id}
                      className={`px-6 lg:px-8 py-4 lg:py-5 grid grid-cols-12 gap-4 items-center ${
                        person.isCurrentUser ? 'bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Avatar & Name */}
                      <div className="col-span-5 lg:col-span-4 flex items-center gap-3 lg:gap-4">
                        <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                          {person.avatar_url && (
                            <AvatarImage src={person.avatar_url} alt={person.name} />
                          )}
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-sm lg:text-base">
                            {getInitials(person.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-800 lg:text-lg">
                            {person.name}
                            {person.isCurrentUser && (
                              <span className="ml-2 text-xs lg:text-sm text-emerald-600 font-semibold">(You)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="col-span-2 lg:col-span-2 text-center">
                        <span className="inline-flex items-center gap-1 text-slate-600 lg:text-lg">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          {person.workouts * 100}
                        </span>
                      </div>

                      {/* Rank */}
                      <div className="col-span-2 lg:col-span-2 text-center">
                        <span className="inline-flex items-center gap-1 lg:text-lg">
                          {index < 3 ? (
                            <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 lg:h-5 lg:w-5 text-rose-500" />
                          )}
                          <span className={index < 3 ? 'text-emerald-600' : 'text-rose-600'}>
                            {index + 1}
                          </span>
                        </span>
                      </div>

                      {/* Workouts */}
                      <div className="col-span-3 lg:col-span-4 text-center">
                        <span className="inline-flex items-center gap-1 lg:text-lg">
                          <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-500" />
                          <span className="text-emerald-600 font-medium">{person.workouts}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
