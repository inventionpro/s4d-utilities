(async () => {
    // default imports
    const Discord = require("discord.js")
    const {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js");
    let process = require('process');
    process.env = require('./env.js');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // block imports
    const os = require("os-utils");
    let Invite = require("discord-inviter-tracker");
    const S4D_APP_PKG_axios = require('axios');
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
    const Database = require("easy-json-database");

    let s4d = {
        Discord,
        fire: null,
        joiningMember: null,
        reply: null,
        player: null,
        manager: null,
        Inviter: null,
        message: null,
        notifer: null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
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
    var argument, sentryid, rating, command, user, prompt2, j, user_tier, user_rpoints, badges, sentryhandler, arguments2, total_reviews, vhelper, reviews_rating, bio, ratingoverall, adm_ds, mang_ds, maro_ds, version, host, AdminRoleID, RolesServer, ModRoleID, ban_ds;

    function colourRandom() {
        var num = Math.floor(Math.random() * Math.pow(2, 24));
        return '#' + ('00000' + num.toString(16)).substr(-6);
    }

    function textToTitleCase(str) {
        return str.replace(/\S+/g,
            function(txt) {
                return txt[0].toUpperCase() + txt.substring(1).toLowerCase();
            });
    }

    function sentry_handler(sentry_command, timestamp, error) {
        sentryid = (S4D_makeid(16));
        sentry.set(String(sentryid), (JSON.stringify({
            "command_used": sentry_command,
            "unix": timestamp,
            "error": error,
        })));
        return sentryid;
    }


    await s4d.client.login(process.env.token).catch((e) => {
        const tokenInvalid = true;
        const tokenError = e;
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("An invalid bot token was provided!")
        } else {
            throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
        }
    });

    s4d.client.on('guildMemberAdd', async (param1) => {
        s4d.joiningMember = param1;
        if (((s4d.joiningMember.guild).id) == '866689038731313193') {
            var welcome = new Discord.MessageEmbed();
            welcome.setColor('#ffffff');
            welcome.setTitle(String((['Welcome ', (s4d.joiningMember.user).username, ' to Scratch For Discord World!'].join(''))))
            welcome.setURL(String());
            welcome.setDescription(String((['**Welcome to the best Scratch For Discord Server! Get started right away:**', '\n', '* Read the rules: <#866689216033587258>', '\n', '* Get your roles and channels: <id:browse>', '\n', '* Come chat with us! <#1025976392745242666>', '\n', '\n', '**Need help?**', '\n', '* Our helpers are always ready for you! Ask your question in <#1025976404187295765>', '\n', '***Have a GREAT stay!***'].join(''))));
            welcome.setThumbnail(String('https://images-ext-1.discordapp.net/external/C1AgTzLEmxTfL4oiR1EWAwv4ZQ_mduzqU17FoBr1xdk/%3Fsize%3D4096/https/cdn.discordapp.com/icons/866689038731313193/46a22b072c98ea952a46437a1afcbe0f.png'));

            (s4d.client.guilds.cache.get('866689038731313193')).channels.cache.get('1025976390564188170').send({
                embeds: [welcome]
            });
            var welcome_dm = new Discord.MessageEmbed();
            welcome_dm.setColor('#ffffff');
            welcome_dm.setTitle(String((['Howdy ', (s4d.joiningMember.user).username, ', welcome to Scratch For Discord World!'].join(''))))
            welcome_dm.setURL(String());
            welcome_dm.setDescription(String((['**Welcome to the best Scratch For Discord Server! We\'re glad to have you join! Get started right away:**', '\n', '* Read the rules: <#866689216033587258>', '\n', '* Get your roles and channels: [here](https://discord.com/channels/866689038731313193/customize-community)', '\n', '* Have a chat with us! <#1025976392745242666>', '\n', '\n', '**Need help?**', '\n', '* Our helpers are always ready for you! Ask your question in <#1025976404187295765> and ping the Helper Available role.', '\n', '***Have a GREAT stay!***'].join(''))));

            (s4d.joiningMember).send({
                embeds: [welcome_dm]
            });
        }
        s4d.joiningMember = null
    });

    RolesServer = (s4d.client.guilds.cache.get('866689038731313193'));

    ModRoleID = '1025976296532095006';

    AdminRoleID = '866691436494061598';

    version = '2.0.1';

    host = 'Private Hosting';

    const count = new Database('./counting.json')
    const moderation = new Database('./mod_db.json')
    const commands = new Database('./cmd-db.json')
    const cmd = new Database('./cmd.json')
    const warns = new Database('./warnings.json')
    const reviews = new Database('./reviews-db.json')
    const suggestions = new Database('./suggestion-db.json')

    s4d.client.on('ready', async () => {
        console.log('[INFO] Bot connected to Discord');

        while (s4d.client && s4d.client.token) {
            await delay(50);
            s4d.client.user.setPresence({
                status: "online",
                activities: [{
                    name: (['s4d!help, ', s4d.client.ws.ping, ' MS'].join('')),
                    type: "WATCHING"
                }]
            });
            await delay(Number(30) * 1000);
            s4d.client.user.setPresence({
                status: "online",
                activities: [{
                    name: '24/7 with EuroFusion',
                    type: "PLAYING"
                }]
            });
            await delay(Number(30) * 1000);

            if (false) {
                console.log('ran')
            }
        }

        while (s4d.client && s4d.client.token) {
            await delay(50);
            console.log('Yes');
            await delay(Number(6000) * 1000);

            if (false) {
                console.log('ran')
            }
        }

    });

    const profiles = new Database('./profiles.json')
    const rewards = new Database('./rewards.json')
    s4d.client.on('messageCreate', async (s4dmessage) => {

        /*
        anti promote
        */
        if ((String(((s4dmessage.content).toLowerCase())).includes(String('discord.gg'))) || (String(((s4dmessage.content).toLowerCase())).includes(String('discord.com/invite/')))) {
            if (!(((s4dmessage.channel).id) == '1025976401440022558')) {
                if (!((s4dmessage.member)._roles.includes(((s4dmessage.guild).roles.cache.get('1025976307143671869')).id))) {
                    var infrinv = new Discord.MessageEmbed();
                    infrinv.setTitle(String(([s4dmessage.author.username, '#', s4dmessage.author.discriminator, ' Got an infraction from automod'].join(''))))
                    infrinv.setURL(String());
                    infrinv.setDescription(String((['Reason: Posting Discord invites', '\n', 'Message: ⚠ ||', s4dmessage.content, '||'].join(''))));
                    infrinv.setColor('#ff6600');

                    s4dmessage.delete();
                    moderation.add(String(('warnings-' + String(s4dmessage.author.id))), parseInt(1));
                    s4d.client.channels.cache.get('1029489074970562560').send({
                        embeds: [infrinv]
                    });
                    if (moderation.get(String(('warnings-' + String(s4dmessage.author.id)))) == 3) {
                        s4dmessage.member.timeout((3600 * 1000), 'Warning threshold of 3 has been reached')
                        var to1inv = new Discord.MessageEmbed();
                        to1inv.setTitle(String(([s4dmessage.author.username, '#', s4dmessage.author.discriminator, ' has been timed out for 1 hour'].join(''))))
                        to1inv.setURL(String());
                        to1inv.setDescription(String((['Reason: Posting Discord invites & Getting 3 infractions', '\n', 'Message: ⚠ ||', s4dmessage.content, '||'].join(''))));
                        to1inv.setColor('#ff0000');

                        s4dmessage.channel.send({
                            embeds: [to1inv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [to1inv]
                        });
                    } else if (moderation.get(String(('warnings-' + String(s4dmessage.author.id)))) == 5) {
                        s4dmessage.member.timeout((10800 * 1000), 'Warning threshold of 5 has been reached')
                        var to3inv = new Discord.MessageEmbed();
                        to3inv.setTitle(String(([s4dmessage.author.username, '#', s4dmessage.author.discriminator, ' has been timed out for 3 hours'].join(''))))
                        to3inv.setURL(String());
                        to3inv.setDescription(String('Reason: Posting Discord invites & Getting 5 infractions'));
                        to3inv.setColor('#ff0000');

                        s4dmessage.channel.send({
                            embeds: [to3inv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [to3inv]
                        });
                    } else if (moderation.get(String(('warnings-' + String(s4dmessage.author.id)))) == 8) {
                        (s4dmessage.member).send({
                            embeds: [{
                                color: String('#ff0000'),
                                title: String('You have been kicked from Scratch For Discord World!'),
                                description: String(`Reason: (automod) Warning threshold of 8 has been reached
              **Extra Notes:**
              Link to join back: https://discord.gg/N4NUxKS4Ja`),
                            }]
                        });
                        await delay(Number(1) * 1000);
                        (s4dmessage.member).kick({
                            reason: 'Warning threshold of 8 has been reached'
                        });
                        var kickinv = new Discord.MessageEmbed();
                        kickinv.setTitle(String(([s4dmessage.author.username, '#', s4dmessage.author.discriminator, ' has been kicked'].join(''))))
                        kickinv.setURL(String());
                        kickinv.setDescription(String('Reason: Posting Discord invites & Getting 8 infractions'));
                        kickinv.setColor('#ff0000');

                        s4dmessage.channel.send({
                            embeds: [kickinv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [kickinv]
                        });
                    } else if (moderation.get(String(('warnings-' + String(s4dmessage.author.id)))) == 12) {
                        (s4dmessage.member).send({
                            embeds: [{
                                color: String('#ff0000'),
                                title: String('You have been banned from Scratch For Discord World!'),
                                description: String(`Reason: (automod) Warning threshold of 12 has been reached
              **Extra Notes:**
              Appeal Form: https://dyno.gg/form/71a7abdd`),
                            }]
                        });
                        var baninv = new Discord.MessageEmbed();
                        baninv.setTitle(String(([s4dmessage.author.username, '#', s4dmessage.author.discriminator, ' has been banned'].join(''))))
                        baninv.setURL(String());
                        baninv.setDescription(String('Reason: Posting Discord invites & Getting 12 infractions'));
                        baninv.setColor('#ff0000');

                        (s4dmessage.member).ban({
                            reason: 'Warning threshold of 12 has been reached'
                        });
                        s4dmessage.channel.send({
                            embeds: [baninv]
                        });
                        s4d.client.channels.cache.get('1029489074970562560').send({
                            embeds: [baninv]
                        });
                    } else {
                        var warninv = new Discord.MessageEmbed();
                        warninv.setTitle(String(([s4dmessage.author.username, '#', s4dmessage.author.discriminator, ' has been warned'].join(''))))
                        warninv.setURL(String());
                        warninv.setDescription(String('Reason: Posting Discord invites'));
                        warninv.setColor('#ff9900');

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
        var j_list = 'kys,nigg,cunt,nazi,faggot'.split(',');
        for (var j_index in j_list) {
            j = j_list[j_index];
            if (String(((s4dmessage.content).toLowerCase())).includes(String(j))) {
                if ((s4dmessage.member).bot) {
                    s4dmessage.delete();
                    s4dmessage.member.timeout((86400 * 1000), 'Using Slurs [Pending verification]')
                    s4dmessage.channel.send({
                        embeds: [{
                            color: String('#ff0000'),
                            title: String(String(s4dmessage.author.tag) + ' [BOT] has been timed out for 1 day.'),
                            description: String(`Reason: Using slurs.
            The owner has been notified and the bot may be removed.`),
                        }]
                    });
                    (s4d.client.users.cache.get(String('767102460673916958'))).send({
                        embeds: [{
                            color: String('#ff0000'),
                            title: String(String(s4dmessage.author.tag) + ' [BOT] has been timed out for 1 day.'),
                            description: String(`Reason: Using slurs.
            Please review the situation.`),
                        }]
                    });
                    s4d.client.channels.cache.find((channel) => channel.name === '1029489074970562560').send({
                        embeds: [{
                            color: String('#ff0000'),
                            title: String(String(s4dmessage.author.tag) + ' [BOT] has been timed out for 1 day.'),
                            description: String(`Reason: Using slurs.
            The owner has been notified and the bot may be removed.`),
                        }]
                    });
                } else {
                    s4dmessage.member.timeout((86400 * 1000), 'Using Slurs')
                        (s4d.client.users.cache.get(String('767102460673916958'))).send({
                            embeds: [{
                                color: String('#ff0000'),
                                title: String(String(s4dmessage.author.tag) + '  has been timed out for 1 day.'),
                                description: String(`Reason: Using slurs.
            Please review the situation.`),
                            }]
                        });
                    (s4dmessage.member).send({
                        embeds: [{
                            color: String('#ff0000'),
                            title: String('You have been timed out in Scratch For Discord World!'),
                            description: String('Reason: Using slurs.'),
                        }]
                    });
                }
            }
        }

        /*
        review thing in support
        */
        if (((s4dmessage.channel).type) == 'GUILD_PUBLIC_THREAD') {
            if (((s4dmessage.channel).parent) == s4d.client.channels.cache.get('1025976404187295765')) {
                var j_list2 = 'thank,ty'.split(',');
                for (var j_index2 in j_list2) {
                    j = j_list2[j_index2];
                    if (String(((s4dmessage.content).toLowerCase())).includes(String(j))) {
                        s4dmessage.channel.send({
                            embeds: [{
                                color: String('#33ccff'),
                                title: String('⭐ Had a good experience?'),
                                description: String(`Please review the helper(s) that helped you. It would be greatly appreciated!
    
              **Use:** \`/review <helper> <1-5> <comment>\``),
                            }]
                        });
                    }
                }
            }
        }

        /*
        suggestions channel reactions + thread
        */
        if (((s4dmessage.channel).id) == '1050461524310892676' && (s4dmessage.author.id) == '1030156986140074054') {
            s4dmessage.startThread({
                    name: 'Discussion',
                    autoArchiveDuration: 60,
                    type: 'GUILD_PUBLIC_THREAD'
                })
                .then(async s4dCreatedThread => {
                    s4dmessage.react('👍');
                    s4dmessage.react('👎');
                })
                .catch(async s4dThreadErr => {
                    if (String(s4dThreadErr) === 'DiscordAPIError: Guild premium subscription level too low') {

                    }
                });
            return
        }

        /*
        general channel help
        */
        if (((s4dmessage.channel).id) == '1025976392745242666' && !((((s4dmessage.content).toLowerCase()) || '').startsWith('s4d!' || ''))) {
            var j_list3 = 'help,how to,how do,how can'.split(',');
            for (var j_index3 in j_list3) {
                j = j_list3[j_index3];
                if (String(((s4dmessage.content).toLowerCase())).includes(String(j))) {
                    s4dmessage.reply({
                        embeds: [{
                            color: String('#ff9900'),
                            description: String('<:thwinkies:959150928785731634> Looking for S4D Help? Please create a post in <#1025976404187295765>!'),
                        }],
                        allowedMentions: {
                            repliedUser: true
                        }
                    });
                    return
                }
            }
            return
        }

        /*
        command handler
        */
        arguments2 = (s4dmessage.content).split(' ');
        command = arguments2.splice(0, 1)[0];
        if ((command || '').startsWith('s4d!' || '')) {
            command = command.slice(4, command.length);
        } else {
            return
        }
        switch (command) {
            case 'help':
                s4dmessage.reply({
                    embeds: [{
                        color: String('#ff6600'),
                        title: String('S4D Utilities Help'),
                        description: String(`Hello! Help has arrived!
          Use \`s4d!cmd <command>\` to get more info about a specific command.
    
          s4d!review - give a review for a helper
          s4d!suggest - suggest something for the server
          s4d!cmd - Get more info about a command
          s4d!ping - Get bot ping`),
                    }],
                    allowedMentions: {
                        repliedUser: true
                    }
                });

                break;
            case 'info':
            case 'ping':

                os.cpuUsage(async function(v) {
                    var obj = v * 100
                    s4dmessage.reply({
                        embeds: [{
                            color: String('#ff6600'),
                            title: String('Bot Information'),
                            description: String(['<a:Online:1067900716296970310> **Ping:** `', s4d.client.ws.ping, ' ms`', '\n', '<:Interface:996912177422282874> **Version:** ', version, '\n', '\n', '<:cpu:877177572406997092> **CPU:** `', Math.round(Number((obj))), '%`', '\n', '<:ram:877177600185864213> **RAM:** `', [Math.round((Number((os.totalmem()))) - (Number((os.freemem())))), 'MB / ', Number((os.totalmem()))].join(''), 'MB`', '\n', '<a:Cd:868829379604648008> **OS:** `', os.platform(), '`', '\n', '<:Host:1067901030827823174> **Host:** `', host, '`'].join('')),
                        }],
                        allowedMentions: {
                            repliedUser: true
                        }
                    });

                });

                break;
            case 'ban':
            case 'b':
                user = arguments2[0];
                if ((s4dmessage.member)._roles.includes((RolesServer.roles.cache.get(AdminRoleID)).id)) {
                    if (user == null) {
                        s4dmessage.reply({
                            embeds: [{
                                color: String('#ff9900'),
                                title: String('Moderation | Ban'),
                                description: String(`**Bans someone off the server.**
              Usage: \`s4d!ban <user> <reason>\`
              Aliasses: \`ban, b\``),
                            }],
                            allowedMentions: {
                                repliedUser: true
                            }
                        });
                    }
                } else if ((s4dmessage.member)._roles.includes((RolesServer.roles.cache.get(ModRoleID)).id)) {
                    s4dmessage.reply({
                        content: String('You do not have the permission to ban. Ask an admin.'),
                        allowedMentions: {
                            repliedUser: true
                        }
                    });
                }

                break;
            case 'suggest':
                s4dmessage.channel.send({
                    content: String('Suggest is temporary disabled.')
                });

                break;
            case 'check':
                s4dmessage.channel.send({
                    content: String((s4d.client.ws.ping))
                });
                s4dmessage.react('✅');
                break;
            case 'admin':
                if (arguments2[0] == 'dangerscan') {
                    adm_ds = [];
                    mang_ds = [];
                    maro_ds = [];
                    ban_ds = [];
                    (s4dmessage.guild).roles.cache.forEach(async (ro) => {
                        if ((ro).permissions.has('ADMINISTRATOR')) {
                            adm_ds.push((ro));
                        } else if ((ro).permissions.has('MANAGE_GUILD')) {
                            mang_ds.push((ro));
                        } else if ((ro).permissions.has('MANAGE_ROLES')) {
                            mang_ds.push((ro));
                        } else if ((ro).permissions.has('BAN_MEMBERS')) {
                            ban_ds.push((ro));
                        }

                    })
                    s4dmessage.reply({
                        embeds: [{
                            color: String('#ff0000'),
                            title: String('Danger Scan'),
                            description: String('Danger scan complete'),
                            fields: [{
                                    name: 'Administrator',
                                    value: (String(adm_ds.join('\n')) + ' '),
                                    inline: true,
                                },
                                {
                                    name: 'Manage_server',
                                    value: (String(mang_ds.join('\n')) + ' '),
                                    inline: true,
                                },
                                {
                                    name: 'Manage_roles',
                                    value: (String(maro_ds.join('\n')) + ' '),
                                    inline: true,
                                },
                                {
                                    name: 'Ban_members',
                                    value: (String(ban_ds.join('\n')) + ' '),
                                    inline: true,
                                },

                            ],
                        }],
                        allowedMentions: {
                            repliedUser: true
                        }
                    });
                }

                break;

        };
        if (((s4dmessage.author).id) == '767102460673916958') {
            if (((s4dmessage.content) || '').startsWith('s4d!eval' || '')) {
                try {
                    s4dmessage.channel.send(await (eval((String((s4dmessage.content)).replaceAll('s4d!eval', String(''))))));

                } catch (err) {
                    s4dmessage.channel.send({
                        content: String((['Error! ```', err, '```'].join('')))
                    });

                }
            }
        }

    });

    s4d.client.on('interactionCreate', async (interaction) => {
        let member = interaction.guild.members.cache.get(interaction.member.user.id)
        if ((interaction.commandName) == 'review') {
            rating = (interaction.options.getInteger('rating'));

            /*
            rating scale check (1-5)
            */
            if (!(rating >= 1 && rating <= 5)) {
                await interaction.reply({
                    embeds: [{
                        color: String('#ff0000'),
                        title: String('Review'),
                        description: String('❌ **You need to give a rating between 1 and 5.**'),
                    }],
                    ephemeral: true,
                    components: []
                });
                return
            }

            /*
            no self review
            */
            if ((interaction.options.getUser('helper')) == (interaction.member)) {
                await interaction.reply({
                    embeds: [{
                        color: String('#ff0000'),
                        title: String('Review'),
                        description: String('❌ **You can\'t review yourself.**'),
                    }],
                    ephemeral: true,
                    components: []
                });
                return
            }

            /*
            no bot review
            */
            if ((interaction.options.getUser('helper')).bot) {
                await interaction.reply({
                    embeds: [{
                        color: String('#ff0000'),
                        title: String('Review'),
                        description: String('❌ **You can\'t review bots.**'),
                    }],
                    ephemeral: true,
                    components: []
                });
                return
            }
            reviews.add(String(('reviewed-' + String((interaction.member).id))), parseInt(1));

            /*
            calculate + database nerdyness + send
            */
            reviews.add(String(('reviews-' + String((interaction.options.getUser('helper')).id))), parseInt(1));
            reviews.add(String(('rating-' + String((interaction.options.getUser('helper')).id))), parseInt(rating));
            total_reviews = reviews.get(String(('reviews-' + String((interaction.options.getUser('helper')).id))));
            reviews_rating = reviews.get(String(('rating-' + String((interaction.options.getUser('helper')).id))));
            ratingoverall = reviews_rating / total_reviews;
            s4d.client.channels.cache.get('1037435739924861038').send({
                content: String((interaction.options.getUser('helper'))),
                embeds: [{
                    color: String('#33ccff'),
                    title: String('You were reviewed!'),
                    description: String([interaction.member, ' has reviewed you as an Helper!', '\n', '\n', '**Review given:** :star: ', rating, '\n', '**Comment:** ', interaction.options.getString('comment'), '\n', '\n', '**Over-all rating:** :star: ', Math.round(ratingoverall), '\n', '**Total reviews:** ', total_reviews].join('')),
                }]
            });

            /*
            succes
            */
            await interaction.reply({
                embeds: [{
                    color: String('#33ccff'),
                    title: String('Reviewing ' + String((interaction.options.getUser('helper')).username)),
                    description: String('✅ Your review has been sent. Thank you very much!'),
                }],
                ephemeral: false,
                components: []
            });
        }
        if ((interaction.commandName) == 'profile') {
            if ((interaction.options.getUser('user')) == null) {

                /*
                Rewards Code
                */
                // rewards check
                if (!rewards.has(String(('tier-' + String((interaction.member).id))))) {
                    user_tier = 'None';
                    user_rpoints = 0;
                } else if (rewards.get(String(('tier-' + String((interaction.member).id)))) == 5) {
                    user_tier = '5 [VIP]';
                    user_rpoints = rewards.get(String(('points-' + String((interaction.member).id))));
                } else {
                    user_tier = rewards.get(String(('tier-' + String((interaction.member).id))));
                    user_rpoints = rewards.get(String(('points-' + String((interaction.member).id))));
                }

                /*
                Badges Code
                */
                if (profiles.get(String(('badges-' + String((interaction.member).id)))) != 'none' && !(profiles.get(String(('badges-' + String((interaction.member).id)))) == null)) {
                    badges = profiles.get(String(('badges-' + String((interaction.member).id))));
                } else {
                    badges = '';
                }
                // vip
                if ((interaction.member)._roles.includes((RolesServer.roles.cache.get('1167912910568296520')).id)) {
                    badges = String(badges) + '<:VIP:1168253487252000808> **VIP** ';
                }
                // og
                if ((interaction.member)._roles.includes((RolesServer.roles.cache.get('1025976326542348359')).id)) {
                    badges = String(badges) + '<:minecraftHeart:887700546687995964> **OG** ';
                }
                // Flow Premium
                if ((interaction.member)._roles.includes((RolesServer.roles.cache.get('1155933625276190770')).id)) {
                    badges = String(badges) + '<:Flow_Premium:1168253434693169203> **Flow Premium** ';
                }
                // Flow Basic
                if ((interaction.member)._roles.includes((RolesServer.roles.cache.get('1080800593867706399')).id)) {
                    badges = String(badges) + '<:Flow_Basic:1168253367143899216> **Flow Basic** ';
                }
                // verified helper
                if ((interaction.member)._roles.includes((RolesServer.roles.cache.get('1168266159351676978')).id)) {
                    badges = String(badges) + '<:verified_server_owner:890546554073657355> *Verified Helper* ';
                    vhelper = '<:verified_server_owner:890546554073657355> **Verified Helper!**';
                } else {
                    vhelper = '**Helper Statistics**';
                }
                if (true) {
                    bio = 'None Set';
                }
                await interaction.reply({
                    embeds: [{
                        color: String(colourRandom()),
                        title: String(String(textToTitleCase((s4d.client.users.cache.get(String(((interaction.member).id)))).username)) + '\'s Profile'),
                        description: String([badges, '\n', '\n', ':heart_decoration: **About me:** ', '\n', bio].join('')),
                        thumbnail: {
                            url: String((interaction.member).displayAvatarURL({
                                format: "png"
                            }))
                        },
                        fields: [{
                                name: 'Rewards & Economy',
                                value: (['**Rewards:**', '\n', '\n', ':gem: **Tier:** ', user_tier, '\n', ':blue_square: **Points:** ', user_rpoints, '\n', '\n', '**Economy:**', '\n', '<:money:1043160500021760071> **Wallet:** ', 'Unavailable', '\n', '<:creditcard:1043160501292642314> **Bank:** ', 'Unavailable', '\n', '<:Info:1081346731041624125>  **Total:** ', 'Unavailable'].join('')),
                                inline: true,
                            },
                            {
                                name: 'Helper',
                                value: ([vhelper, '\n', '\n', '**Rating:** ', '5 <:thumbsUpS4D:887700059737710613>', '\n', '**Ratings:** ', '2 (placeholder)', '\n', '**Reviewed:** ', '0'].join('')),
                                inline: true,
                            },

                        ],
                        image: {
                            url: String('')
                        },
                    }],
                    ephemeral: false,
                    components: []
                });
            } else {
                await interaction.reply({
                    content: 'Viewing others\' profiles is in beta.',
                    ephemeral: true,
                    components: []
                });
            }
        }
        if ((interaction.commandName) == 'flow') {
            await interaction.reply({
                embeds: [{
                    color: String('#33ccff'),
                    title: String('S4D Flow'),
                    description: String(['Choose the Flow Plan that best fits your needs. Starting at 500 Economy Credits per month or 5000 Credits per year.', '\n', `Every Flow plan includes:
        * Exclusive role with color
        * Cool perks
        * Access to a special chat`].join('')),
                    thumbnail: {
                        url: String()
                    },
                    fields: [{
                            name: '<:Flow_Basic:1168253367143899216> Flow Basic',
                            value: '',
                            inline: true,
                        },
                        {
                            name: '<:Flow_Premium:1168253434693169203> Flow Plus',
                            value: '',
                            inline: true,
                        },
                        {
                            name: '<a:FlowPremium:1169338764603179088> Flow Premium',
                            value: '',
                            inline: true,
                        },

                    ],
                }],
                ephemeral: true,
                components: []
            });
        }
        if ((interaction.commandName) == 'test') {
            flow.set(String('subscribers'), []);
            await interaction.reply({
                content: 'ok',
                ephemeral: true,
                components: []
            });
        }

    });

    synchronizeSlashCommands(s4d.client, [{
        name: 'review',
        description: 'Review an helper!',
        options: [{
            type: 6,
            name: 'helper',
            required: true,
            description: 'Name the helper here.',
            choices: [

            ]
        }, {
            type: 4,
            name: 'rating',
            required: true,
            description: 'Give a rating of 1-5',
            choices: [

            ]
        }, {
            type: 3,
            name: 'comment',
            required: true,
            description: 'Give a rating of 1-5',
            choices: [

            ]
        }, ]
    }, {
        name: 'profile',
        description: 'View an user profile.',
        options: [{
            type: 6,
            name: 'user',
            required: false,
            description: 'Mention an user here to view their profile',
            choices: [

            ]
        }, ]
    }, {
        name: 'flow',
        description: 'View Flow plans.',
        options: [

        ]
    }, {
        name: 'test',
        description: 'test.',
        options: [

        ]
    }, ], {
        debug: false,

    });

    s4d.client.on('threadCreate', async (s4dThread) => {
        if ((((s4dThread).parent).id) == '1025976404187295765') {
            await delay(Number(1) * 1000);
            (s4dThread).send({
                content: String('[BETA]'),
                embeds: [{
                    color: String('#ff6600'),
                    title: String('Welcome to support, We\'re here to help!'),
                    description: String(['Hello! Welcome to S4D Wold Support! While you wait for assistance, please explain your problem further and provide screenshots if necessary. This will help us solve your problem faster.', '\n', '|| WIP, will not work! If your case is solved, please send **/solved** Thank you!||', '\n', 'Good luck with your project! - S4DW Team'].join('')),
                }]
            });
        }

    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (s4dmessage.author.bot) {
            return;
        }
        argument = (s4dmessage.content).split(' ');
        command = argument.shift();
        user = argument.shift();
        rating = argument.shift();
        reason = argument.join(' ');

        /*
        counting channel
        */
        if (((s4dmessage.channel).id) == '1068486368596082688') {
            if (((s4dmessage.content) || '').startsWith('!' || '')) {
                return
            }
            if ((Number((s4dmessage.content))) == count.get(String('count')) + 1) {
                if (count.get(String('previous_counter')) == ((s4dmessage.member).id)) {
                    s4dmessage.reply({
                        content: String('Please let somebody else count the next number!'),
                        allowedMentions: {
                            repliedUser: true
                        }
                    }).then(async (s4dfrost_real_reply) => {
                        s4dmessage.react('❌');
                        await delay(Number(5) * 1000);
                        s4dfrost_real_reply.delete();
                        s4dmessage.delete();

                    });
                } else {
                    count.add(String('count'), parseInt(1));
                    count.set(String('previous_counter'), ((s4dmessage.member).id));
                    s4dmessage.react('✅');
                    try {
                        if (count.get(String('count')) == count.get(String('goal'))) {
                            s4dmessage.channel.send({
                                embeds: [{
                                    color: String('#ffffff'),
                                    title: String('🎉🎉🎉 GOAL REACHED!!! 🎉🎉🎉'),
                                    description: String(['We hit our goal of `', count.get(String('goal')), '`! :tada:', '\n', 'New goal: `', count.get(String('goal')) + 1000, '`'].join('')),
                                }]
                            }).then(async (s4dreply) => {
                                (s4dmessage).pin()
                            });
                            count.add(String('goal'), parseInt(1000));
                            eval((['s4d.client.channels.cache.get(\'1068486368596082688\').setTopic(\'', 'Goal: ', count.get(String('goal')), ' | Count here with fellow members! one count per message and wait for someone else to count before sending another message.\')'].join('')));
                        }

                    } catch (err) {
                        s4dmessage.react('⚠');
                        console.log((err));

                    }
                }
            } else {
                s4dmessage.reply({
                    content: String(('Please stick to the count, next number is ' + String(count.get(String('count')) + 1))),
                    allowedMentions: {
                        repliedUser: true
                    }
                }).then(async (s4dfrost_real_reply) => {
                    s4dmessage.react('❌');
                    await delay(Number(5) * 1000);
                    s4dfrost_real_reply.delete();
                    s4dmessage.delete();

                });
            }
            return
        }
        if (command == 's4d!review') {
            s4dmessage.channel.send({
                embeds: [{
                    color: String('#ff9900'),
                    title: String('Reviewing has moved...'),
                    description: String('Reviewing has moved to slash commands!'),
                    thumbnail: {
                        url: String('https://cdn.discordapp.com/emojis/901891914629009448.webp?size=48&name=CS_Slashcmd&quality=lossless')
                    },
                }]
            });
        }
        if (command == 'Flow:demoBasic') {
            (s4dmessage.channel).send({
                embeds: [{
                    color: String('#33ccff'),
                    title: String('A wild Gift appears!'),
                    description: String(`### S4D Flow Basic (1 Month)
        Get sweet, sweet chat and server perks!`),
                    thumbnail: {
                        url: String('https://cdn.discordapp.com/emojis/1168253367143899216.webp?size=96&quality=lossless')
                    },
                }],
                components: [(new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId('claimbasic')
                        .setLabel('Claim')
                        .setEmoji('')
                        .setDisabled(false)
                        .setStyle(('PRIMARY')),
                    ))]
            }).then(async m => {

            });
        }
        if (command == 'Flow:demoPlus') {
            (s4dmessage.channel).send({
                embeds: [{
                    color: String('#9999ff'),
                    title: String('A wild Gift appears!'),
                    description: String(`### S4D Flow Plus (1 Month)
        Get sweet premium chat and server perks!`),
                    thumbnail: {
                        url: String('https://cdn.discordapp.com/emojis/1168253434693169203.webp?size=96&quality=lossless')
                    },
                }],
                components: [(new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId('claimplus')
                        .setLabel('Claim')
                        .setEmoji('')
                        .setDisabled(false)
                        .setStyle(('PRIMARY')),
                    ))]
            }).then(async m => {

            });
        }
        if (command == 'Flow:demoPremium') {
            (s4dmessage.channel).send({
                embeds: [{
                    color: String('#6600cc'),
                    title: String('A wild Gift appears!'),
                    description: String(`### S4D Flow Premium (1 Month)
        Get sweet perks and Premium Services!`),
                    thumbnail: {
                        url: String('https://cdn.discordapp.com/emojis/1168253434693169203.webp?size=96&quality=lossless')
                    },
                }],
                components: [(new MessageActionRow()
                    .addComponents(new MessageButton()
                        .setCustomId('claimpremium')
                        .setLabel('Claim')
                        .setEmoji('')
                        .setDisabled(false)
                        .setStyle(('PRIMARY')),
                    ))]
            }).then(async m => {

            });
        }

    });

    s4d.Inviter.on('UserInvited', async function(member, uses, inviter, invite) {
        s4d.client.channels.cache.get('1025976414475915356').send({
            embeds: [{
                color: String('#33ff33'),
                title: String('New join!'),
                description: String([(member).username, ' was invited by ', (inviter).username, '. This member has now ', uses, ' invite(s).'].join('')),
            }]
        });

    });

    s4d.Inviter.on('UserLeave', async function(member, uses, inviter, invite) {
        s4d.client.channels.cache.get('1025976414475915356').send({
            embeds: [{
                color: String('#ff0000'),
                title: String('User leave'),
                description: String([(member).username, ' was invited by ', (inviter).username, '. This member has now ', uses, ' invite(s).'].join('')),
            }]
        });

    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (s4dmessage.author.bot) {
            return;
        }
        argument = (s4dmessage.content).split(' ');
        command = argument.shift();
        prompt2 = argument.join(' ');
        if (command == 's4d!imagine') {
            if (commands.get(String('disabled-imagine')) == 'false') {
                s4dmessage.channel.send({
                    embeds: [{
                        color: String('#ff6600'),
                        title: String('Your image is being generated'),
                        description: String(['Prompt:', prompt2, '\n', 'Your image should take about 10 sec.'].join('')),
                    }]
                }).then(async (s4dreply) => {
                    S4D_APP_PKG_axios({
                            method: "get",
                            url: ('https://api.fsh.plus/imagine?text=' + String(String(prompt2).replaceAll(' ', String('%20')))),

                            headers: {
                                'content-type': 'application/json',

                            },

                        })
                        .then(async (response) => {
                            s4dreply.edit({
                                embeds: [{
                                    color: String('#ff6600'),
                                    title: String('Your image is generated!'),
                                    description: String(['Prompt:', prompt2, '\n', 'Your image was generated. Powered by Fsh API'].join('')),
                                    image: {
                                        url: String(response.data.link)
                                    },
                                }]
                            });

                        })
                        .catch(async (err) => {
                            sentryhandler = sentry_handler('imagine', Math.floor(new Date().getTime() / 1000), err);
                            s4dmessage.reply({
                                content: String(('There was an error. please DM HitByaThunder and give him this code: ' + String(sentryhandler))),
                                allowedMentions: {
                                    repliedUser: true
                                }
                            });

                        });
                    commands.add(String('generations'), parseInt(1));

                });
            } else {
                s4dmessage.reply({
                    embeds: [{
                        color: String('#ff6600'),
                        title: String('Command disabled!'),
                        description: String('⛔ This command has been disabled. Reason: ' + String(commands.get(String('disabled-r-imagine')))),
                    }],
                    allowedMentions: {
                        repliedUser: true
                    }
                });
            }
        }

    });

    const sentry = new Database('./sentry-errors.json')
    const flow = new Database('./flow_sub.json')
    s4d.client.on('messageCreate', async (s4dmessage) => {
        if ((s4dmessage.content) == 's4d!flow' || (s4dmessage.content) == 's4d!s4dflow') {
            s4dmessage.reply({
                content: String('Sale of S4D Flow is currently paused. Please check back later!'),
                allowedMentions: {
                    repliedUser: true
                }
            });
        }

    });

    return s4d
})();