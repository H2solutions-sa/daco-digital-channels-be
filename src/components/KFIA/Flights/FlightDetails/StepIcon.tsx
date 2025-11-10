"use client";
import {
  BadgeCheck, Bus, ShieldCheck, Luggage, Footprints, Armchair,
  DoorOpen, ShoppingBag, CircleDot,
} from "lucide-react";
import { BADGE_ICON, BADGE_WRAP } from "./design";

export default function StepIcon({ id }: { id: string }) {
  switch (id) {
    case "ready":          return <Wrap><BadgeCheck className={BADGE_ICON} /></Wrap>;
    case "transport":      return <Wrap><Bus className={BADGE_ICON} /></Wrap>;
    case "presec":
    case "security":       return <Wrap><ShieldCheck className={BADGE_ICON} /></Wrap>;
    case "checkin":
    case "baggage":        return <Wrap><Luggage className={BADGE_ICON} /></Wrap>;
    case "walk-to-security":
    case "walk-to-gate":
    case "arrival-walk":   return <Wrap><Footprints className={BADGE_ICON} /></Wrap>;
    case "relax":
    case "arrival-amenities": return <Wrap><Armchair className={BADGE_ICON} /></Wrap>;
    case "boarding":       return <Wrap><DoorOpen className={BADGE_ICON} /></Wrap>;
    case "arrivals-zone":
    case "welcome":        return <Wrap><ShoppingBag className={BADGE_ICON} /></Wrap>;
    case "arrival":
    case "customs":
    case "immigration":
    case "onward":         return <Wrap><CircleDot className={BADGE_ICON} /></Wrap>;
    default:               return <Wrap><BadgeCheck className={BADGE_ICON} /></Wrap>;
  }
}
function Wrap({ children }: { children: React.ReactNode }) {
  return <span className={BADGE_WRAP}>{children}</span>;
}