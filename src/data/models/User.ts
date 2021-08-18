import { model, Schema, Document } from 'mongoose'

interface DefaultObject {
    _id: string,
    price: number,
    url: string
}

class UserSettings {
    isAdmin: boolean = false
    isBeta: boolean = false
    isPremium: boolean = false
}

class UserEconomy {
    card: number = 0
    wallet: number = 0
    badges: DefaultObject[] = []
    backgrounds: DefaultObject[] = []
}

export interface UserDocument extends Document {
    _id: string,
    settings: UserSettings,
    economy: UserEconomy,
}

const UserSchema = new Schema({
    _id: String,
    settings: { type: Object, default: new UserSettings() },
    economy: { type: Object, default: new UserEconomy() }
}, {
    timestamps: true
})

export const SavedUser = model<UserDocument>('User', UserSchema)
