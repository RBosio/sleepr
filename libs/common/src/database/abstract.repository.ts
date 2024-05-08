import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { BaseDocument } from './abstract.schema';
import { Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';

export abstract class AbstractRepository<TDocument extends BaseDocument>
  implements BaseRepository<TDocument>
{
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await this.model.create(createDocument)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findById(filterQuery)
      .lean<TDocument>(true);

    if (!document)
      this.logger.warn('Documents was not found with filterQuery', {
        filterQuery,
      });
    return document;
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>(true);
    if (!document)
      this.logger.warn('Documents was not found with filterQuery', {
        filterQuery,
      });

    return document;
  }

  async find(): Promise<TDocument[]> {
    return this.model.find().lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
