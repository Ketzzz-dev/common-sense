import { APIApplicationCommandBasicOption, APIApplicationCommandOption, APIApplicationCommandOptionChoice, APIApplicationCommandSubcommandOption, ApplicationCommandOptionType, ChannelType } from 'discord.js'

export interface SlashCommandOption {
    name: string
    description: string

    toJSON(): APIApplicationCommandOption 
}

export class AttachmentOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean
        }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Attachment,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        return json
    }
}
export class BooleanOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean
        }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Boolean,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        return json
    }

}
export class ChannelOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean,
            channelTypes?: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[]
        },
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Channel,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        if (this.config?.channelTypes)
            json.channel_types = this.config.channelTypes

        return json
    }
}
export class IntegerOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean,
            minValue?: number,
            maxValue?: number,
            choices?: APIApplicationCommandOptionChoice<number>[],
            autocomplete?: boolean
        }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Integer,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        if (this.config?.minValue)
            json.min_value = this.config.minValue
        if (this.config?.maxValue)
            json.max_value = this.config.maxValue
        if (!this.config?.autocomplete && this.config?.choices)
            json.choices = this.config.choices
        if (!this.config?.choices && this.config?.autocomplete)
            json.autocomplete = this.config.autocomplete as false

        return json
    }
}
export class MentionableOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean
        }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Mentionable,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        return json
    }
}
export class NumberOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean,
            minValue?: number,
            maxValue?: number,
            choices?: APIApplicationCommandOptionChoice<number>[],
            autocomplete?: boolean
        }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Number,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        if (this.config?.minValue)
            json.min_value = this.config.minValue
        if (this.config?.maxValue)
            json.max_value = this.config.maxValue
        if (!this.config?.autocomplete && this.config?.choices)
            json.choices = this.config.choices
        if (!this.config?.choices && this.config?.autocomplete)
            json.autocomplete = this.config.autocomplete as false

        return json
    }
}
export class RoleOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private required?: boolean,
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Role,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        return json
    }
}
export class StringOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: {
            required?: boolean,
            minLength?: number,
            maxLength?: number,
            choices?: APIApplicationCommandOptionChoice<string>[],
            autocomplete?: boolean
        }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.String,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        if (this.config?.minLength)
            json.min_length = this.config.minLength
        if (this.config?.maxLength)
            json.max_length = this.config.maxLength
        if (!this.config?.autocomplete && this.config?.choices)
            json.choices = this.config.choices
        if (!this.config?.choices && this.config?.autocomplete)
            json.autocomplete = this.config.autocomplete as false

        return json
    }
}
export class UserOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private config?: { required?: boolean }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.User,
            name: this.name, description: this.description,
            required: this.config?.required ?? false
        }

        return json
    }
}
export class SubcommandOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private options?: SlashCommandOption[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Subcommand,
            name: this.name, description: this.description
        }

        if (this.options)
            json.options = this.options.map(c => c.toJSON()) as APIApplicationCommandBasicOption[]

        return json
    }
}
export class SubcommandGroupOption implements SlashCommandOption {
    public constructor(
        public name: string,
        public description: string,
        private options?: SlashCommandOption[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: this.name, description: this.description
        }

        if (this.options)
            json.options = this.options.map(c => c.toJSON()) as APIApplicationCommandSubcommandOption[]

        return json
    }
}