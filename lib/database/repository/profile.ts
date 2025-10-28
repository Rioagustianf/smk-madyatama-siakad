export interface ProfileRepository {
  get(): Promise<any | null>;
  upsert(payload: any): Promise<any>;
}


