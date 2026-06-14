/* eslint-disable */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTeam, useJoinTeam, useLeaveTeam } from "@/lib/api/hackathon/queries";
import { Loader2, Plus, LogOut, UserPlus, Copy, Check, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HackathonTeamManagementProps {
  hackathonId: string;
  userTeam?: {
    id: string;
    name: string;
  };
}

export function HackathonTeamManagement({
  hackathonId,
  userTeam,
}: HackathonTeamManagementProps) {
  const [teamName, setTeamName] = useState("");
  const [teamIdInput, setTeamIdInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"initial" | "create" | "join">("initial");

  const createTeamMutation = useCreateTeam();
  const joinTeamMutation = useJoinTeam();
  const leaveTeamMutation = useLeaveTeam();

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }
    createTeamMutation.mutate({ id: hackathonId, payload: { name: teamName.trim() } });
  };

  const handleJoinTeam = () => {
    if (!teamIdInput.trim()) {
      toast.error("Please enter an invitation code");
      return;
    }
    joinTeamMutation.mutate({ id: hackathonId, teamId: teamIdInput.trim() });
  };

  const copyToClipboard = () => {
    if (userTeam) {
      navigator.clipboard.writeText(userTeam.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Invitation code copied");
    }
  };

  // If team status updates while modal/view is open, reset to initial
  if (userTeam && userTeam.id && view !== "initial") {
    setView("initial");
  }

  if (userTeam && userTeam.id) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-white/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{userTeam.name}</h3>
            <p className="text-gray-400 text-sm">Active Team Member</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden h-10 px-3 items-center gap-2 group flex-1 md:flex-initial">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:inline">Code:</span>
            <code className="text-primary text-xs font-mono truncate max-w-[100px]">{userTeam.id}</code>
            <button onClick={copyToClipboard} className="text-gray-400 hover:text-white transition-colors ml-auto">
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { if(confirm("Leave team?")) leaveTeamMutation.mutate(hackathonId) }}
            className="text-gray-500 hover:text-red-400 h-10 w-10 hover:bg-red-400/10"
            disabled={leaveTeamMutation.isPending}
          >
            {leaveTeamMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "create") {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Create New Team</h3>
          <button onClick={() => setView("initial")} className="text-gray-500 hover:text-white text-xs">Cancel</button>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Team Name" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="bg-black/40 border-white/10 h-12 text-white"
            autoFocus
          />
          <Button 
            onClick={handleCreateTeam} 
            disabled={createTeamMutation.isPending}
            className="h-12 px-6 font-bold"
          >
            {createTeamMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "join") {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Join Existing Team</h3>
          <button onClick={() => setView("initial")} className="text-gray-500 hover:text-white text-xs">Cancel</button>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Invitation Code" 
            value={teamIdInput}
            onChange={(e) => setTeamIdInput(e.target.value)}
            className="bg-black/40 border-white/10 h-12 text-white font-mono"
            autoFocus
          />
          <Button 
            variant="secondary"
            onClick={handleJoinTeam} 
            disabled={joinTeamMutation.isPending}
            className="h-12 px-6 font-bold"
          >
            {joinTeamMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <button 
        onClick={() => setView("create")}
        className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-primary/50 text-left group"
      >
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Plus className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-white font-bold">Create Team</h4>
          <p className="text-gray-500 text-xs">Build your own dream team</p>
        </div>
      </button>

      <button 
        onClick={() => setView("join")}
        className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-blue-500/50 text-left group"
      >
        <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-white font-bold">Join Team</h4>
          <p className="text-gray-500 text-xs">Enter an invitation code</p>
        </div>
      </button>
    </div>
  );
}
