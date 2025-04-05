import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    //Create
    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    //Read
    async findOne(filter: FilterQuery<T>): Promise<T | null> { 
        return await this.model.findOne(filter);
    }

    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> { 
        return await this.model.find(filter);
    }

    //Update
    async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, data, {new: true});
    }

    //Delete
    async delete(filter: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOneAndDelete(filter);
    }
}