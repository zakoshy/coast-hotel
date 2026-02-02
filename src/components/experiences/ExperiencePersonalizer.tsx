
"use client";

import React, { useState } from 'react';
import { personalizedExperienceRecommendations } from '@/ai/flows/personalized-experience-recommendations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

const ExperiencePersonalizer = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [formData, setFormData] = useState({
    travelStyle: 'relaxation',
    interests: 'beach and ocean',
    budget: 'luxury'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await personalizedExperienceRecommendations({
        travelStyle: formData.travelStyle,
        interests: formData.interests,
        budget: formData.budget
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-headline font-bold text-primary mb-2">Create Your Itinerary</h3>
        <p className="text-sm text-muted-foreground">Select your preferences below</p>
      </div>

      {!recommendations ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Travel Style</Label>
            <Select 
              value={formData.travelStyle} 
              onValueChange={(val) => setFormData({...formData, travelStyle: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
                <SelectItem value="adventure">Action & Adventure</SelectItem>
                <SelectItem value="cultural">Culture & Heritage</SelectItem>
                <SelectItem value="family">Family Fun</SelectItem>
                <SelectItem value="romantic">Romantic Escape</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <Select 
              value={formData.interests} 
              onValueChange={(val) => setFormData({...formData, interests: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="What do you love?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water sports">Water Sports & Diving</SelectItem>
                <SelectItem value="wildlife">Wildlife & Nature</SelectItem>
                <SelectItem value="gastronomy">Food & Gastronomy</SelectItem>
                <SelectItem value="history">History & Architecture</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget Preference</Label>
            <Select 
              value={formData.budget} 
              onValueChange={(val) => setFormData({...formData, budget: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury Premium</SelectItem>
                <SelectItem value="mid-range">Mid-range Comfort</SelectItem>
                <SelectItem value="budget-friendly">Value Focused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            disabled={loading} 
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Designing your journey...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My Recommendations
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-headline font-bold text-xl">Your Custom Coastal Journey</h4>
            <Button variant="ghost" size="sm" onClick={() => setRecommendations(null)}>Reset</Button>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <p className="text-foreground leading-relaxed font-medium">{rec}</p>
              </div>
            ))}
          </div>
          <Button className="w-full h-14 text-lg font-bold" onClick={() => window.location.href = '#booking'}>
            Book This Experience
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExperiencePersonalizer;
