export interface BaseRepository<TDocument> {
  create(document: Omit<TDocument, '_id'>): Promise<TDocument>;
  find(): Promise<TDocument[]>;
  findOne(filterQuery: object): Promise<TDocument>;
}
