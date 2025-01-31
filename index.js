const Discord = require("discord.js")
const { MessageEmbed, MessageButton, MessageActionRow, Intents, Permissions, MessageSelectMenu } = require("discord.js");

let process = require('process');
process.env = require('./env.js');

const os = require("os-utils");
let Invite = require("discord-inviter-tracker");
const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
const DB = require("fshdb");

const count = new DB('databases/counting.json');
const moderation = new DB('databases/mod_db.json');
const commands = new DB('databases/cmd-db.json');
const cmd = new DB('databases/cmd.json');
const warns = new DB('databases/warnings.json');
const reviews = new DB('databases/reviews-db.json');
const suggestions = new DB('databases/suggestion-db.json');
const profiles = new DB('databases/profiles.json');
const rewards = new DB('databases/rewards.json');
const sentry = new DB('databases/sentry-errors.json');
const flow = new DB('databases/flow_sub.json');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async() => {
    let s4d = {
        Discord,
        reply: null,
        Inviter: null,
        message: null
    };

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION",
            "CHANNEL"
        ]
    });

    // when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // upon error print "Error!" and the error
    process.on('uncaughtException', function(err) {
        console.log('Error!');
        console.log(err);
    });

    // pre blockly code
    s4d.Inviter = new Invite(s4d.client)
    s4d.Inviter.on("WARN", function(e) {
        console.log('WARN: ' + e)
    })

    function S4D_makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < Number(length); i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    // blockly code
    var argument, command, user, prompt2, j, arguments2;

    function colourRandom() {
        var num = Math.floor(Math.random() * Math.pow(2, 24));
        return '#' + ('00000' + num.toString(16)).substr(-6);
    }

    function sentry_handler(sentry_command, timestamp, error) {
        let sentryid = S4D_makeid(16);
        sentry.set(sentryid, JSON.stringify({
            command_used: sentry_command,
            unix: timestamp,
            error: error
        }));
        return sentryid;
    }


    await s4d.client.login(process.env.token).catch((e) => {
        console.log(e);
    });

    s4d.client.on('guildMemberAdd', async(joiningMember) => {
        if (joiningMember.guild.id === '866689038731313193') {
            let welcome = new MessageEmbed()
                .setColor('#ffffff')
                .setTitle(`Welcome ${(joiningMember.user.displayName ?? joiningMember.user.username)} to Scratch For Discord World!`)
                .setThumbnail('https://cdn.discordapp.com/icons/866689038731313193/50da05402eaabd4619da8dafd5553601.png')
                .setDescription(`**Welcome to the best Scratch For Discord Server! Get started right away:**
* Read the rules: <#866689216033587258>
* Get your roles and channels: <id:browse>
* Come chat with us! <#1025976392745242666>

**Need help?**
* Our helpers are always ready for you! Ask your question in <#1025976404187295765>
***Have a GREAT stay!***`);

            s4d.client.guilds.cache.get('866689038731313193').channels.cache.get('1025976390564188170').send({
                embeds: [welcome]
            });
            let welcome_dm = new MessageEmbed()
                .setColor('#ffffff')
                .setTitle(`Howdy ${(joiningMember.user.displayName ?? joiningMember.user.username)} welcome to Scratch For Discord World!`)
                .setDescription(`**Welcome to the best Scratch For Discord Server! We're glad to have you join! Get started right away:**
* Read the rules: <#866689216033587258>
* Get your roles and channels: [here](https://discord.com/channels/866689038731313193/customize-community)
* Have a chat with us! <#1025976392745242666>

**Need help?**
* Our helpers are always ready for you! Ask your question in <#1025976404187295765> and ping the Helper Available role.
***Have a GREAT stay!***`);

            joiningMember.send({
                embeds: [welcome_dm]
            });
        }
    });

    const AdminRoleID = '866691436494061598';
    const ModRoleID = '1025976296532095006';

    const version = '2.1.0';
    const host = 'Private Hosting';

    s4d.client.on('ready', async () => {
        console.log('[INFO] Bot connected to Discord');

        while (s4d.client && s4d.client.token) {
            s4d.client.user.setPresence({
                status: "online",
                activities: [{
                    name: `s4d!help, ${s4d.client.ws.ping} MS`,
                    type: "WATCHING"
                }]
            });
            await delay(30 * 1000);
            s4d.client.user.setPresence({
                status: "online",
                activities: [{
                    name: '24/7 with EuroFusion',
                    type: "PLAYING"
                }]
            });
            await delay(30 * 1000);
        }
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {

        /*
        anti promote
        */
        if (s4dmessage.content.toLowerCase().includes('discord.gg') || s4dmessage.content.toLowerCase().includes('discord.com/invite/')) {
            if (s4dmessage.channel.id !== '1025976401440022558') {
                if (!s4dmessage.member._roles.includes('1025976307143671869')) {
                    let infrinv = new MessageEmbed()
                        .setTitle(`${(s4dmessage.member.displayName ?? s4dmessage.author.username)} Got an infraction from automod`)
                        .setDescription(`Reason: Posting Discord invites
Message: ⚠ ||${s4dmessage.content}||`)
                        .setColor('#ff6600');

                    s4dmessage.delete();
                    moderation.add(`warnings-${s4dmessage.author.id}`, 1);
                    s4d.client.channels.cache.get('1029489074970562560').send({
                        embeds: [infrinv]
                    });
                    if (moderation.get(`warnings-${s4dmessage.author.id}`) == 3) {
                        s4dmessage.member.timeout((3600 * 1000), 'Warning threshold of 3 has been reached')
                        let to1inv = new MessageEmbed()
                            .setTitle(`${(s4dmessage.member.displayName ?? s4dmessage.author.username)} has been timed out for 1 hour`)
                            .setDescription(`Reason: Posting Discord invites & Getting 3 infractions
Message: ⚠ ||${s4dmessage.content}||`)
                            .setColor('#ff0000');

                        s4dmessage.channel.send({
                            embeds: [to1inv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [to1inv]
                        });
                    } else if (moderation.get(`warnings-${s4dmessage.author.id}`) == 5) {
                        s4dmessage.member.timeout((10800 * 1000), 'Warning threshold of 5 has been reached')
                        let to3inv = new MessageEmbed()
                            .setTitle(`${(s4dmessage.member.displayName ?? s4dmessage.author.username)} has been timed out for 3 hours`)
                            .setDescription(`Reason: Posting Discord invites & Getting 5 infractions`)
                            .setColor('#ff0000');

                        s4dmessage.channel.send({
                            embeds: [to3inv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [to3inv]
                        });
                    } else if (moderation.get(`warnings-${s4dmessage.author.id}`) == 8) {
                        s4dmessage.member.send({
                            embeds: [{
                                color: '#ff0000',
                                title: 'You have been kicked from Scratch For Discord World!',
                                description: (`Reason: (automod) Warning threshold of 8 has been reached
**Extra Notes:**
Link to join back: https://discord.gg/N4NUxKS4Ja`),
                            }]
                        });
                        await delay(1000);
                        s4dmessage.member.kick({
                            reason: 'Warning threshold of 8 has been reached'
                        });
                        let kickinv = new MessageEmbed()
                            .setTitle(`${(s4dmessage.member.displayName ?? s4dmessage.author.username)} has been kicked`)
                            .setDescription('Reason: Posting Discord invites & Getting 8 infractions')
                            .setColor('#ff0000');

                        s4dmessage.channel.send({
                            embeds: [kickinv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [kickinv]
                        });
                    } else if (moderation.get(`warnings-${s4dmessage.author.id}`) == 12) {
                        s4dmessage.member.send({
                            embeds: [{
                                color: '#ff0000',
                                title: 'You have been banned from Scratch For Discord World!',
                                description: `Reason: (automod) Warning threshold of 12 has been reached
**Extra Notes:**
Appeal Form: https://dyno.gg/form/71a7abdd`,
                            }]
                        });
                        let baninv = new MessageEmbed()
                            .setTitle(`${(s4dmessage.member.displayName ?? s4dmessage.author.username)} has been banned`)
                            .setDescription('Reason: Posting Discord invites & Getting 12 infractions')
                            .setColor('#ff0000');

                        s4dmessage.member.ban({
                            reason: 'Warning threshold of 12 has been reached'
                        });
                        s4dmessage.channel.send({
                            embeds: [baninv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [baninv]
                        });
                    } else {
                        let warninv = new MessageEmbed()
                            .setTitle(`${(s4dmessage.member.displayName ?? s4dmessage.author.username)} has been warned`)
                            .setDescription('Reason: Posting Discord invites')
                            .setColor('#ff9900');

                        s4dmessage.channel.send({
                            embeds: [warninv]
                        });
                    }
                }
            }
        }

        /*
        content filter (fsh api in future :trol:)
        */
        var j_list = 'kys,nigg,cunt,fagg'.split(',');
        for (var j_index in j_list) {
            j = j_list[j_index];
            if (s4dmessage.content.toLowerCase().includes(j)) {
                if (s4dmessage.member.bot) {
                    s4dmessage.delete();
                    s4dmessage.member.timeout((86400 * 1000), 'Using Slurs [Pending verification]')
                    s4dmessage.channel.send({
                        embeds: [{
                            color: '#ff0000',
                            title: s4dmessage.author.tag + ' [BOT] has been timed out for 1 day.',
                            description: `Reason: Using slurs.
The owner has been notified and the bot may be removed.`
                        }]
                    });
                    (s4d.client.users.cache.get('767102460673916958')).send({
                        embeds: [{
                            color: '#ff0000',
                            title: s4dmessage.author.tag + ' [BOT] has been timed out for 1 day.',
                            description: `Reason: Using slurs.
Please review the situation.`
                        }]
                    });
                    s4d.client.channels.cache.find((channel) => channel.name === '1029489074970562560').send({
                        embeds: [{
                            color: '#ff0000',
                            title: s4dmessage.author.tag + ' [BOT] has been timed out for 1 day.',
                            description: `Reason: Using slurs.
The owner has been notified and the bot may be removed.`
                        }]
                    });
                } else {
                    s4dmessage.member.timeout((86400 * 1000), 'Using Slurs')
                        (s4d.client.users.cache.get(('767102460673916958'))).send({
                            embeds: [{
                                color: '#ff0000',
                                title: s4dmessage.author.tag + '  has been timed out for 1 day.',
                                description: `Reason: Using slurs.
Please review the situation.`
                            }]
                        });
                    s4dmessage.member.send({
                        embeds: [{
                            color: '#ff0000',
                            title: 'You have been timed out in Scratch For Discord World!',
                            description: 'Reason: Using slurs.'
                        }]
                    });
                }
            }
        }

        /*
        review thing in support
        */
        if (s4dmessage.channel.type == 'GUILD_PUBLIC_THREAD') {
            if (s4dmessage.channel.parent == s4d.client.channels.cache.get('1025976404187295765')) {
                var j_list2 = 'thank,ty'.split(',');
                for (var j_index2 in j_list2) {
                    j = j_list2[j_index2];
                    if (s4dmessage.content.toLowerCase().includes(j)) {
                        s4dmessage.channel.send({
                            embeds: [{
                                color: '#33ccff',
                                title: '⭐ Had a good experience?',
                                description: `Please review the helper(s) that helped you. It would be greatly appreciated!

**Use:** \`/review <helper> <1-5> <comment>\``,
                            }]
                        });
                    }
                }
            }
        }

        /*
        suggestions channel reactions + thread
        */
        if (s4dmessage.channel.id == '1050461524310892676' && s4dmessage.author.id == '1030156986140074054') {
            s4dmessage.startThread({
                    name: 'Discussion',
                    autoArchiveDuration: 60,
                    type: 'GUILD_PUBLIC_THREAD'
                })
                .then(() => {
                    s4dmessage.react('👍');
                    s4dmessage.react('👎');
                })
            return;
        }

        /*
        general channel help
        */
        if (s4dmessage.channel.id == '1025976392745242666' && !(s4dmessage.content.toLowerCase() ?? '').startsWith('s4d!')) {
            var j_list3 = 'help,how to,how do,how can'.split(',');
            for (var j_index3 in j_list3) {
                j = j_list3[j_index3];
                if (s4dmessage.content.toLowerCase().includes(j)) {
                    s4dmessage.reply({
                        embeds: [{
                            color: '#ff9900',
                            description: '<:thwinkies:959150928785731634> Looking for S4D Help? Please create a post in <#1025976404187295765>!'
                        }]
                    });
                    return;
                }
            }
            return;
        }

        /*
        command handler
        */
        arguments2 = (s4dmessage.content).split(' ');
        command = arguments2.splice(0, 1)[0];
        if ((command ?? '').startsWith('s4d!')) {
            command = command.slice(4, command.length);
        } else {
            return;
        }
        switch (command) {
            case 'help':
                s4dmessage.reply({
                    embeds: [{
                        color: '#ff6600',
                        title: 'S4D Utilities Help',
                        description: `Hello! Help has arrived!
Use \`s4d!cmd <command>\` to get more info about a specific command.

s4d!review - give a review for a helper
s4d!suggest - suggest something for the server
s4d!cmd - Get more info about a command
s4d!ping - Get bot ping`
                    }]
                });
                break;
            case 'info':
            case 'ping':
                os.cpuUsage(async function(v) {
                    var obj = v * 100
                    s4dmessage.reply({
                        embeds: [{
                            color: '#ff6600',
                            title: 'Bot Information',
                            description: `<a:Online:1067900716296970310> **Ping:** \`${s4d.client.ws.ping} ms\`
<:Interface:996912177422282874> **Version:** ${version}

<:cpu:877177572406997092> **CPU:** \`${Math.round(obj)}%\`
<:ram:877177600185864213> **RAM:** \`${[Math.round((Number((os.totalmem()))) - (Number((os.freemem())))), 'MB / ', Number((os.totalmem()))].join('')}MB\`
<a:Cd:868829379604648008> **OS:** \`${os.platform()}\`
<:Host:1067901030827823174> **Host:** \`${host}\``
                        }]
                    });
                });
                break;
            case 'ban':
            case 'b':
                user = arguments2[0];
                if (s4dmessage.member._roles.includes(AdminRoleID)) {
                    if (user == null) {
                        s4dmessage.reply({
                            embeds: [{
                                color: '#ff9900',
                                title: 'Moderation | Ban',
                                description: `**Bans someone off the server.**
Usage: \`s4d!ban <user> <reason>\`
Aliasses: \`ban, b\``
                            }]
                        });
                    }
                } else if (s4dmessage.member._roles.includes(ModRoleID)) {
                    s4dmessage.reply('You do not have the permission to ban. Ask an admin.');
                }
                break;
            case 'suggest':
                s4dmessage.channel.send('Suggest is temporary disabled.');
                break;
            case 'check':
                s4dmessage.channel.send(s4d.client.ws.ping);
                s4dmessage.react('✅');
                break;
        };
        if (s4dmessage.author.id == '767102460673916958') {
            if ((s4dmessage.content ?? '').startsWith('s4d!eval')) {
                try {
                    s4dmessage.channel.send(await eval(s4dmessage.content.replace('s4d!eval', '')));
                } catch (err) {
                    s4dmessage.channel.send('Error! ```' + err + '```');
                }
            }
        }
    });

    s4d.client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName == 'review') {
            let rating = interaction.options.getInteger('rating');

            /*
            rating scale check (1-5)
            */
            if (rating < 1 || rating > 5) {
                await interaction.reply({
                    embeds: [{
                        color: '#ff0000',
                        title: 'Review',
                        description: '❌ **You need to give a rating between 1 and 5.**'
                    }],
                    ephemeral: true
                });
                return;
            }

            /*
            no self review
            */
            if (interaction.options.getUser('helper') == interaction.user) {
                await interaction.reply({
                    embeds: [{
                        color: '#ff0000',
                        title: 'Review',
                        description: '❌ **You can\'t review yourself.**'
                    }],
                    ephemeral: true
                });
                return;
            }

            /*
            no bot review
            */
            if ((interaction.options.getUser('helper')).bot) {
                await interaction.reply({
                    embeds: [{
                        color: '#ff0000',
                        title: 'Review',
                        description: '❌ **You can\'t review bots.**'
                    }],
                    ephemeral: true
                });
                return
            }
            reviews.add('reviewed-' + interaction.user.id, 1);

            /*
            calculate + database nerdyness + send
            */
            reviews.add('reviews-' + interaction.options.getUser('helper').id, 1);
            reviews.add('rating-' + interaction.options.getUser('helper').id, rating);
            let total_reviews = reviews.get('reviews-' + interaction.options.getUser('helper').id);
            let reviews_rating = reviews.get('rating-' + interaction.options.getUser('helper').id);
            let ratingoverall = reviews_rating / total_reviews;
            s4d.client.channels.cache.get('1037435739924861038').send({
                content: `<@${interaction.options.getUser('helper').id}>`,
                embeds: [{
                    color: '#33ccff',
                    title: 'You were reviewed!',
                    description: `${interaction.member} has reviewed you as an Helper!

**Review given:** :star: ${rating}
**Comment:** ${interaction.options.getString('comment')}

**Over-all rating:** :star: ${Math.round(ratingoverall)}
**Total reviews:** ${total_reviews}`
                }]
            });

            /*
            succes
            */
            await interaction.reply({
                embeds: [{
                    color: '#33ccff',
                    title: 'Reviewing ' + (interaction.options.getUser('helper').displayName ?? interaction.options.getUser('helper').username),
                    description: '✅ Your review has been sent. Thank you very much!'
                }],
                ephemeral: false
            });
        }
        if (interaction.commandName == 'profile') {
            if (interaction.options.getUser('user') == null) {
                /*
                Rewards Code
                */
                let user_tier = 'None';
                let user_rpoints = 0;
                if (!rewards.has('tier-' + interaction.user.id)) {
                    user_tier = 'None';
                    user_rpoints = 0;
                } else if (rewards.get('tier-' + interaction.user.id) == 5) {
                    user_tier = '5 [VIP]';
                    user_rpoints = rewards.get('points-' + interaction.user.id);
                } else {
                    user_tier = rewards.get('tier-' + interaction.user.id);
                    user_rpoints = rewards.get('points-' + interaction.user.id);
                }

                /*
                Badges Code
                */
                let badges = '';
                let vhelper = '';
                if (!profiles.has('badges-' + interaction.user.id)) {
                    badges = '';
                } else {
                    badges = profiles.get('badges-' + interaction.user.id);
                }
                // vip
                if (interaction.member._roles.includes('1167912910568296520')) {
                    badges += '<:VIP:1168253487252000808> **VIP** ';
                }
                // og
                if (interaction.member._roles.includes('1025976326542348359')) {
                    badges += '<:minecraftHeart:887700546687995964> **OG** ';
                }
                // Flow Premium
                if (interaction.member._roles.includes('1155933625276190770')) {
                    badges += '<:Flow_Premium:1168253434693169203> **Flow Premium** ';
                }
                // Flow Basic
                if (interaction.member._roles.includes('1080800593867706399')) {
                    badges += '<:Flow_Basic:1168253367143899216> **Flow Basic** ';
                }
                // verified helper
                if (interaction.member._roles.includes('1168266159351676978')) {
                    badges += '<:verified_server_owner:890546554073657355> *Verified Helper* ';
                    vhelper = '<:verified_server_owner:890546554073657355> **Verified Helper!**';
                } else {
                    vhelper = '';
                }
                /*
                Reviews
                */
                let total_reviews = reviews.get('reviews-' + interaction.user.id);
                let reviews_rating = reviews.get('rating-' + interaction.user.id);
                let ratingoverall = reviews_rating / total_reviews;
                // Send
                await interaction.reply({
                    embeds: [{
                        color: colourRandom(),
                        title: (interaction.member.displayName ?? interaction.member.username) + "'s Profile",
                        description: `${badges}

:heart_decoration: **About me:**
None Set`,
                        thumbnail: {
                            url: interaction.member.displayAvatarURL({
                                format: "png",
                            })
                        },
                        fields: [
                            {
                                name: 'Rewards:',
                                value: `:gem: Tier: ${user_tier}
:blue_square: Points: ${user_rpoints}

**Economy:**
<:Info:1081346731041624125> Total: Unavailable
<:money:1043160500021760071> Wallet: Unavailable
<:creditcard:1043160501292642314> Bank: Unavailable`,
                                inline: true
                            },
                            {
                                name: 'Helper',
                                value: `${vhelper}

Rating: ${ratingoverall} :star:
Over-all rating: ${reviews_rating}
Reviews: ${total_reviews}`,
                                inline: true
                            }
                        ]
                    }],
                    ephemeral: false
                });
            } else {
                await interaction.reply({
                    content: "Viewing others' profiles is in beta.",
                    ephemeral: true
                });
            }
        }
        if (interaction.commandName == 'flow') {
            await interaction.reply({
                embeds: [{
                    color: '#33ccff',
                    title: 'S4D Flow',
                    description: `Choose the Flow Plan that best fits your needs. Starting at 500 Economy Credits per month or 5000 Credits per year.
Every Flow plan includes:
* Exclusive role with color
* Cool perks
* Access to a special chat`,
                    fields: [
                        {
                            name: '<:Flow_Basic:1168253367143899216> Flow Basic',
                            value: '',
                            inline: true
                        },
                        {
                            name: '<:Flow_Premium:1168253434693169203> Flow Plus',
                            value: '',
                            inline: true
                        },
                        {
                            name: '<a:FlowPremium:1169338764603179088> Flow Premium',
                            value: '',
                            inline: true
                        }
                    ]
                }],
                ephemeral: true
            });
        }
    });

    synchronizeSlashCommands(s4d.client, [
        {
            name: 'review',
            description: 'Review an helper!',
            options: [
                {
                    type: 6,
                    name: 'helper',
                    required: true,
                    description: 'The person that helped you'
                },
                {
                    type: 4,
                    name: 'rating',
                    required: true,
                    description: 'Give a rating of 1-5'
                },
                {
                    type: 3,
                    name: 'comment',
                    required: true,
                    description: 'A comment to attach'
                }
            ]
        },
        {
            name: 'profile',
            description: 'View an user profile.',
            options: [
                {
                    type: 6,
                    name: 'user',
                    required: false,
                    description: 'Mention a user to view their profile'
                }
            ]
        },
        {
            name: 'flow',
            description: 'View Flow plans.'
        }
    ], { debug: false });

    s4d.client.on('threadCreate', async (s4dThread) => {
        if (s4dThread.parent.id == '1025976404187295765') {
            await delay(1000);
            s4dThread.send({
                content: '[BETA]',
                embeds: [{
                    color: '#ff6600',
                    title: 'Welcome to support, We\'re here to help!',
                    description: `Hello! Welcome to S4D Wold Support! While you wait for assistance, please explain your problem further and provide screenshots if necessary. This will help us solve your problem faster.
|| If your case is solved, please send **/solved** Thank you! (WIP)||
Good luck with your project! - S4DW Staff`
                }]
            });
        }
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (s4dmessage.author.bot) {
            return;
        }
        argument = s4dmessage.content.split(' ');
        command = argument.shift();
        user = argument.shift();
        rating = argument.shift();
        reason = argument.join(' ');

        /*
        counting channel
        */
        if (s4dmessage.channel.id == '1068486368596082688') {
            if ((s4dmessage.content ?? '').startsWith('!')) {
                return
            }
            if (s4dmessage.content == count.get('count') + 1) {
                if (count.get('previous_counter') == s4dmessage.author.id) {
                    s4dmessage.reply('Please let somebody else count the next number!')
                        .then(async(s4dfrost_real_reply) => {
                            s4dmessage.react('❌');
                            await delay(5 * 1000);
                            s4dfrost_real_reply.delete();
                            s4dmessage.delete();
                        });
                } else {
                    count.add('count', 1);
                    count.set('previous_counter', s4dmessage.author.id);
                    s4dmessage.react('✅');
                    try {
                        if (count.get('count') == count.get('goal')) {
                            s4dmessage.channel.send({
                                embeds: [{
                                    color: '#ffffff',
                                    title: '🎉🎉🎉 GOAL REACHED!!! 🎉🎉🎉',
                                    description: `We hit our goal of \`${count.get('goal')}\`! :tada:
New goal: \`${count.get('goal') + 1000}\``
                                }]
                            })
                                .then(() => {
                                    s4dmessage.pin()
                                });
                            count.add('goal', 1000);
                            s4d.client.channels.cache.get('1068486368596082688').setTopic(`Goal: ${count.get('goal')} | Count here with fellow members! one count per message and wait for someone else to count before sending another message.`);
                        }
                    } catch (err) {
                        s4dmessage.react('⚠');
                        console.log(err);
                    }
                }
            } else {
                s4dmessage.react('❌');
                s4dmessage.reply(`Please stick to the count, next number is ${count.get('count')+1}`)
                    .then(async(s4dfrost_real_reply) => {
                        await delay(5 * 1000);
                        s4dfrost_real_reply.delete();
                        s4dmessage.delete();
                    });
            }
            return;
        }
        if (command == 's4d!review') {
            s4dmessage.channel.send({
                embeds: [{
                    color: '#ff9900',
                    title: 'Reviewing has moved...',
                    description: 'Reviewing has moved to slash commands!',
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/emojis/901891914629009448.webp?size=48&name=CS_Slashcmd&quality=lossless'
                    }
                }]
            });
        }
        if (command == 'Flow:demoBasic') {
            s4dmessage.channel.send({
                embeds: [{
                    color: '#33ccff',
                    title: 'A wild Gift appears!',
                    description: `### S4D Flow Basic (1 Month)
Get sweet, sweet chat and server perks!`,
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/emojis/1168253367143899216.webp?size=96&quality=lossless'
                    }
                }],
                components: [
                    new MessageActionRow()
                        .addComponents(new MessageButton()
                            .setCustomId('claimbasic')
                            .setLabel('Claim')
                            .setStyle('PRIMARY'))
                ]
            })
        }
        if (command == 'Flow:demoPlus') {
            s4dmessage.channel.send({
                embeds: [{
                    color: '#9999ff',
                    title: 'A wild Gift appears!',
                    description: `### S4D Flow Plus (1 Month)
Get sweet premium chat and server perks!`,
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/emojis/1168253434693169203.webp?size=96&quality=lossless'
                    }
                }],
                components: [
                    new MessageActionRow()
                        .addComponents(new MessageButton()
                            .setCustomId('claimplus')
                            .setLabel('Claim')
                            .setStyle('PRIMARY'))
                ]
            })
        }
        if (command == 'Flow:demoPremium') {
            s4dmessage.channel.send({
                embeds: [{
                    color: '#6600cc',
                    title: 'A wild Gift appears!',
                    description: `### S4D Flow Premium (1 Month)
Get sweet perks and Premium Services!`,
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/emojis/1168253434693169203.webp?size=96&quality=lossless'
                    }
                }],
                components: [
                    new MessageActionRow()
                        .addComponents(new MessageButton()
                            .setCustomId('claimpremium')
                            .setLabel('Claim')
                            .setStyle('PRIMARY'))
                ]
            })
        }
    });

    s4d.Inviter.on('UserInvited', async function(member, uses, inviter, invite) {
        s4d.client.channels.cache.get('1025976414475915356').send({
            embeds: [{
                color: '#33ff33',
                title: 'New join!',
                description: `${(member.displayName ?? member.username)} was invited by ${(inviter.displayName ?? inviter.username)}. This member has now ${uses} invite(s).`
            }]
        });
    });

    s4d.Inviter.on('UserLeave', async function(member, uses, inviter, invite) {
        s4d.client.channels.cache.get('1025976414475915356').send({
            embeds: [{
                color: '#ff0000',
                title: 'User leave',
                description: `${(member.displayName ?? member.username)} was invited by ${(inviter.displayName ?? inviter.username)}. This member has now ${uses} invite(s).`
            }]
        });
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (s4dmessage.author.bot) {
            return;
        }
        argument = s4dmessage.content.split(' ');
        command = argument.shift();
        prompt2 = argument.join(' ');
        if (command == 's4d!imagine') {
            if (commands.get('disabled-imagine') == 'false') {
                s4dmessage.channel.send({
                    embeds: [{
                        color: '#ff6600',
                        title: 'Your image is being generated',
                        description: `Prompt: ${prompt2}
Your image should take about 10 sec.`
                    }]
                })
                    .then(async(s4dreply) => {
                        let img;
                        try {
                            img = await fetch('https://api.fsh.plus/imagine?text=' + encodeURIComponent(prompt2));
                            img = await img.json();
                            s4dreply.edit({
                                embeds: [{
                                    color: ('#ff6600'),
                                    title: ('Your image is generated!'),
                                    description: (['Prompt:', prompt2, '\n', 'Your image was generated. Powered by Fsh API'].join('')),
                                    image: {
                                        url: (response.data.link)
                                    },
                                }]
                            });
                            commands.add('generations', 1);
                        } catch(err) {
                            let sentryhandler = sentry_handler('imagine', Math.floor(new Date().getTime() / 1000), err);
                            s4dmessage.reply('There was an error. please DM HitByaThunder and give him this code: ' + sentryhandler);
                        }
                    });
            } else {
                s4dmessage.reply({
                    embeds: [{
                        color: '#ff6600',
                        title: 'Command disabled!',
                        description: '⛔ This command has been disabled. Reason: ' + commands.get('disabled-r-imagine')
                    }]
                });
            }
        }
    });

    s4d.client.on('messageCreate', async(s4dmessage) => {
        if (s4dmessage.content == 's4d!flow' || s4dmessage.content == 's4d!s4dflow') {
            s4dmessage.reply({
                content: ('Sale of S4D Flow is currently paused. Please check back later!')
            });
        }
    });

    return s4d;
})();