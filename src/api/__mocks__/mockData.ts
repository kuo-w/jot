import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { Jot } from "types";

export const jot1 = {
    guid: "123",
    text: "test",
    createdAt: dayjs().add(1, "day").toJSON(),
};

export const jot2 = {
    guid: "456",
    text: "test",
    createdAt: new Date().toJSON(),
};

export const jot3 = {
    guid: "789",
    text: "test",
    createdAt: dayjs().subtract(1, "day").toJSON(),
};

export function njot({
    text = "",
    topics = [],
}: {
    text?: string;
    topics?: string[];
}): Jot {
    return {
        guid: uuidv4(),
        text: text,
        createdAt: Date.now().toString(),
        topics: topics,
    };
}
