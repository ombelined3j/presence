// Architecture des rappels quotidiens.
//
// Aujourd'hui : l'heure et le fuseau sont enregistrés dans profiles (reminder_time, timezone).
// Aucun service d'envoi n'est branché, donc AUCUNE notification n'est envoyée ni simulée.
//
// Pour brancher un canal plus tard (push web, email) :
// 1. Implémenter ReminderChannel (ex. WebPushChannel avec un service worker + VAPID,
//    ou EmailChannel via une Edge Function Supabase planifiée qui lit reminder_time/timezone).
// 2. L'ajouter dans `channels` ci-dessous.

export interface ReminderChannel {
  id: 'push' | 'email';
  label: string;
  isAvailable(): Promise<boolean>;
  subscribe(userId: string): Promise<void>;
}

const channels: ReminderChannel[] = [];

export function availableReminderChannels(): ReminderChannel[] {
  return channels;
}

export function remindersAreDelivered(): boolean {
  return channels.length > 0;
}
