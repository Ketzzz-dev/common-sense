import { APIApplicationCommandBasicOption, APIApplicationCommandOption, APIApplicationCommandOptionChoice, APIApplicationCommandSubcommandOption, ApplicationCommandOptionType, ChannelType } from 'discord.js'

export interface CommandOption {
    toJSON(): APIApplicationCommandOption 
}

export class AttachmentOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Attachment,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        return json
    }
}
export class BooleanOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Boolean,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        return json
    }

}
export class ChannelOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private channelTypes?: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Channel,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        if (this.channelTypes)
            json.channel_types = this.channelTypes

        return json
    }
}
export class IntegerOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private minValue?: number,
        private maxValue?: number,
        private choices?: APIApplicationCommandOptionChoice<number>[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Integer,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        if (this.minValue)
            json.min_value = this.minValue
        if (this.maxValue)
            json.max_value = this.maxValue
        if (this.choices)
            json.choices = this.choices

        return json
    }
}
export class MentionableOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Mentionable,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        return json
    }
}
export class NumberOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private minValue?: number,
        private maxValue?: number,
        private choices?: APIApplicationCommandOptionChoice<number>[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Number,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        if (this.minValue)
            json.min_value = this.minValue
        if (this.maxValue)
            json.max_value = this.maxValue
        if (this.choices)
            json.choices = this.choices

        return json
    }
}
export class RoleOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
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
export class StringOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private minLength?: number,
        private maxLength?: number,
        private choices?: APIApplicationCommandOptionChoice<string>[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.String,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        if (this.minLength)
            json.min_length = this.minLength
        if (this.maxLength)
            json.min_length = this.maxLength
        if (this.choices)
            json.choices = this.choices

        return json
    }
}
export class UserOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.User,
            name: this.name, description: this.description,
            required: this.required ?? false
        }

        return json
    }
}
export class SubcommandOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private options?: CommandOption[]
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
export class SubcommandGroupOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private options?: CommandOption[]
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