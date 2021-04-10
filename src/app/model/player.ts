export interface Player {
  id: string;
  name: string;
  dateCreated: number;
  image?: string;
  disabled?: boolean;

  // bgg
  bggId?: number;
}
