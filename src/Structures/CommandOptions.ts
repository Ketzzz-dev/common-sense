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
            required: this.required
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
            required: this.required
        }

        return json
    }

}
export class ChannelOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private config?: { channelTypes?: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[] }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Channel,
            name: this.name, description: this.description,
            required: this.required, channel_types: this.config?.channelTypes
        }

        return json
    }
}
export class IntegerOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private config?: { minValue?: number, maxValue?: number, choices?: APIApplicationCommandOptionChoice<number>[], autocomplete?: boolean }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Integer,
            name: this.name, description: this.description,
            required: this.required,
            min_value: this.config?.minValue, max_value: this.config?.maxValue,
            choices: this.config?.choices, autocomplete: this.config?.autocomplete
        }

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
            required: this.required,
        }

        return json
    }
}
export class NumberOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private config?: { minValue?: number, maxValue?: number, choices?: APIApplicationCommandOptionChoice<number>[], autocomplete?: boolean }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.Number,
            name: this.name, description: this.description,
            required: this.required,
            min_value: this.config?.minValue, max_value: this.config?.maxValue,
            choices: this.config?.choices, autocomplete: this.config?.autocomplete
        }

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
            required: this.required
        }

        return json
    }
}
export class StringOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private required?: boolean,
        private config?: { minLength?: number, maxLength?: number, choices?: APIApplicationCommandOptionChoice<string>[] }
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.String,
            name: this.name, description: this.description,
            required: this.required,
            min_length: this.config?.minLength, max_length: this.config?.maxLength,
            choices: this.config?.choices
        }

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
            required: this.required
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
            name: this.name, description: this.description,
            options: (this.options ?? []).map(c => c.toJSON()) as APIApplicationCommandBasicOption[]
        }

        return json
    }
}
export class SubcommandGroupOption implements CommandOption {
    public constructor(
        private name: string,
        private description: string,
        private children?: CommandOption[]
    ) {}

    public toJSON(): APIApplicationCommandOption {
        let json: APIApplicationCommandOption = {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: this.name, description: this.description,
            options: (this.children ?? []).map(c => c.toJSON()) as APIApplicationCommandSubcommandOption[]
        }

        return json
    }
}