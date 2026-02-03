
"use client";

import React, { useState } from 'react';
import { personalizedExperienceRecommendations } from '@/ai/flows/personalized-experience-recommendations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, CheckCircle2, Waves, Compass, Utensils, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperiencePersonalizer = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [formData, setFormData] = useState({
    travelStyle: 'relaxation',
    interests: 'water sports',
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
      console.error('AI Flow Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!recommendations ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-secondary/10 rounded-2xl text-secondary mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-headline font-bold text-primary mb-2">Create Your Dream Itinerary</h3>
              <p className="text-muted-foreground">Our AI concierge will curate a personalized Coastal journey just for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label className="font-bold text-primary flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    Travel Style
                  </Label>
                  <Select 
                    value={formData.travelStyle} 
                    onValueChange={(val) => setFormData({...formData, travelStyle: val})}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-primary/10 shadow-sm font-medium">
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

                <div className="space-y-3">
                  <Label className="font-bold text-primary flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    Primary Interests
                  </Label>
                  <Select 
                    value={formData.interests} 
                    onValueChange={(val) => setFormData({...formData, interests: val})}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-primary/10 shadow-sm font-medium">
                      <SelectValue placeholder="What do you love?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water sports">Water Sports & Diving</SelectItem>
                      <SelectItem value="wildlife">Wildlife & Nature Safaris</SelectItem>
                      <SelectItem value="gastronomy">Fine Dining & Local Cuisine</SelectItem>
                      <SelectItem value="history">Historical Sites & Villages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="font-bold text-primary flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Experience Budget
                  </Label>
                  <Select 
                    value={formData.budget} 
                    onValueChange={(val) => setFormData({...formData, budget: val})}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-primary/10 shadow-sm font-medium">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury & Private Tours</SelectItem>
                      <SelectItem value="mid-range">Standard Group Excursions</SelectItem>
                      <SelectItem value="budget-friendly">Affordable Local Experiences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                disabled={loading} 
                className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Designing Your Perfect Day...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Generate AI Recommendations
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-headline font-bold text-primary mb-2">Your Bespoke Journey</h3>
              <p className="text-muted-foreground">Hand-picked experiences for your stay in Diani.</p>
            </div>

            <div className="grid gap-4">
              {recommendations.map((rec, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 p-6 rounded-2xl bg-primary/5 border border-primary/10 group hover:bg-white hover:shadow-xl hover:border-secondary/20 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground leading-relaxed font-bold text-lg">{rec}</p>
                    <p className="text-sm text-muted-foreground">Curated based on your travel style and interests.</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="flex-1 h-16 text-lg font-bold rounded-2xl bg-secondary hover:bg-secondary/90 shadow-lg" 
                onClick={() => window.location.href = '#booking'}
              >
                Book These Now
              </Button>
              <Button 
                variant="outline"
                className="flex-1 h-16 text-lg font-bold rounded-2xl border-primary/20 text-primary hover:bg-primary/5" 
                onClick={() => setRecommendations(null)}
              >
                Recalculate
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperiencePersonalizer;
