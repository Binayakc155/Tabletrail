"use client";

import { FormEvent, useState } from "react";
import { Loader2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function GuestReviewForm({ restaurantId }: { restaurantId: string }) {
  const [rating, setRating] = useState(5);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, guestName: form.get("guestName"), comment: form.get("comment") }),
    });
    const result = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok) {
      setError(result?.message ?? "Unable to submit your review.");
      return;
    }
    event.currentTarget.reset();
    setRating(5);
    setMessage(result?.message ?? "Thanks for sharing your review!");
  }

  return (
    <form className="space-y-5 rounded-xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl" onSubmit={submit}>
      <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">Share your experience</h3><p className="mt-1 text-sm text-white/55">No account needed. Your review is published immediately.</p></div><div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" className="rounded p-1 transition hover:bg-white/10" onClick={() => setRating(value)} aria-label={`${value} star rating`}><Star className={`h-5 w-5 ${value <= rating ? "fill-orange-400 text-orange-400" : "text-white/20"}`} /></button>)}</div></div>
      <div className="space-y-2"><Label htmlFor="guest-name" className="text-white/75">Name (optional)</Label><Input id="guest-name" name="guestName" maxLength={80} placeholder="Anonymous diner" className="border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-orange-400" /></div>
      <div className="space-y-2"><Label htmlFor="guest-comment" className="text-white/75">Review (optional)</Label><Textarea id="guest-comment" name="comment" maxLength={2000} placeholder="Tell other diners about your visit." className="min-h-28 border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-orange-400" /></div>
      {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}{message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      <Button type="submit" disabled={pending} className="bg-orange-500 text-white hover:bg-orange-400">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Submit review</Button>
    </form>
  );
}
