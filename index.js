// Set up
const Discord = require('discord.js');

let process = require('process');
process.env = require('./env.js');

process.on('uncaughtException', function(err) {
  console.log('Error!');
  console.log(err);
});

// Imports
const os = require('os-utils');
const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
const DB = require('fshdb');

const count = new DB('databases/counting.json');
const moderation = new DB('databases/mod_db.json');
const reviews = new DB('databases/reviews-db.json');
const suggestions = new DB('databases/suggestion-db.json');
const rewards = new DB('databases/rewards.json');
const flow = new DB('databases/flow_sub.json');

// Utils
const version = '2.1.0';
const Channels = {
  support: '1025976404187295765',
  general: '1025976392745242666',
  reviews: '1037435739924861038',
  suggest: '1050461524310892676'
};
const AdminRoleID = '866691436494061598';
const ModRoleID = '1025976296532095006';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Client
const client = new Discord.Client({
  intents: [
    Object.values(Discord.GatewayIntentBits).reduce((acc, p) => acc | p, 0)
  ],
  partials: [
    Discord.Partials.Channel,
    Discord.Partials.Reaction
  ]
});

client.on('ready', async () => {
  console.log(client.user.tag + ' is alive!');

  while (client && client.token) {
    client.user.setPresence({
      status: 'online',
      activities: [{
        name: `s4d!help | ${client.ws.ping}ms`,
        type: Discord.ActivityType.Watching
      }]
    });
    await delay(30 * 1000); // 30 secs
  }
});

// Register slash
synchronizeSlashCommands(client, [
  {
    name: 'review',
    description: 'Review an helper!',
    options: [
      {
        required: true,
        type: Discord.ApplicationCommandOptionType.User,
        name: 'helper',
        description: 'The person that helped you'
      },
      {
        required: true,
        type: Discord.ApplicationCommandOptionType.Integer,
        name: 'rating',
        description: 'Give a rating of 1-5',
        min_value: 1,
        max_value: 5
      },
      {
        required: true,
        type: Discord.ApplicationCommandOptionType.String,
        name: 'comment',
        description: 'A comment to attach'
      }
    ]
  },
  {
    name: 'profile',
    description: 'View an user profile.',
    options: [
      {
        required: false,
        type: Discord.ApplicationCommandOptionType.User,
        name: 'user',
        description: 'Mention a user to view their profile'
      }
    ]
  },
  {
    name: 'flow',
    description: 'View Flow plans.'
  }
], { debug: false });

// Main
(async()=>{
  let user;

  // Login
  await client.login(process.env.token).catch((e) => {
    console.log(e);
  });

  client.on('messageCreate', async (message) => {
    // Suggestions channel reactions + thread
    if (message.channel.id === Channels.suggest && message.author.id === '1030156986140074054') {
      message.react('👍');
      message.react('👎');
      message.startThread({
        name: 'Discussion',
        autoArchiveDuration: 60
      });
      return;
    }

    if (message.content==='s4d!check') {
      message.reply(client.ws.ping);
      return;
    }

    if (message.author.bot) return;

    /* General channel help redirect */
    if (message.channel.id === Channels.general && !(message.content.toLowerCase() ?? '').startsWith('s4d!')) {
      if ((/help|how (?:to|do|can)/i).test(message.content)) {
        message.reply({
          embeds: [{
            color: '#ff9900',
            description: `<:thwinkies:959150928785731634> Looking for S4D Help? Please create a post in <#${Channels.support}>!`
          }]
        });
        return;
      }
    }

    /* Review reminder in support */
    if (message.channel.type === Discord.ChannelType.PublicThread) {
      if (message.channel.parent.id === Channels.support) {
        if ((/th(?:ank|nx|x)(?:you)?|ty(?:sm|vm)?/i).test(message.content)) {
          message.channel.send({
            embeds: [{
              color: '#33ccff',
              title: '⭐ Had a good experience?',
              description: `Please review the helper(s) that helped you. It would be greatly appreciated!

**Use:** \`/review <helper> <1-5> <comment>\``,
            }]
          });
          return;
        }
      }
    }

    // Command handler
    let arguments2 = message.content.split(' ');
    let command = arguments2[0]??'';
    if (!command.startsWith('s4d!')) return;
    command = command.slice(4, command.length);

    switch(command) {
      case 'help':
        message.reply({
          embeds: [{
            color: '#ff6600',
            title: 'S4D Utilities Help',
            description: `Hello! Help has arrived!

s4d!help - This
s4d!ping - Get bot ping
s4d!suggest - Suggest something for the server`
          }]
        });
        break;
      case 'info':
      case 'ping':
        os.cpuUsage(async(cpu)=>{
          message.reply({
            embeds: [{
              color: '#ff6600',
              title: 'Bot Information',
              description: `<a:Online:1067900716296970310> **Ping:** \`${client.ws.ping}ms\`
<:Interface:996912177422282874> **Version:** ${version}

<:cpu:877177572406997092> **CPU:** \`${Math.round(cpu*100)}%\`
<:ram:877177600185864213> **RAM:** \`${Math.round(os.totalmem() - os.freemem())} MB / ${os.totalmem()}MB\`
<a:Cd:868829379604648008> **OS:** \`${os.platform()}\``
            }]
          });
        });
        break;
      case 'suggest':
        message.channel.send('Suggest is temporary disabled.');
        break;

      case 'ban':
        user = arguments2[0];
        if (message.member._roles.includes(AdminRoleID)) {
          if (user == null) {
            message.reply({
              embeds: [{
                color: '#ff9900',
                title: 'Moderation | Ban',
                description: `**Bans someone off the server.**
Usage: \`s4d!ban <user> <reason>\``
              }]
            });
          }
        } else if (message.member._roles.includes(ModRoleID)) {
          message.reply('You do not have the permission to ban. Ask an admin.');
        }
        break;
      case 'eval':
        if (message.author.id !== '816691475844694047') return;
        try {
          message.reply(await eval(message.content.replace('s4d!eval ', '')));
        } catch (err) {
          message.reply('Error! ```\n' + err + '\n```');
        }
    };
  });

  client.on('interactionCreate', async (interaction) => {
    let rating, helper, total_reviews, ratingoverall = null;
    switch(interaction.commandName) {
      case 'review':
        rating = Math.floor(interaction.options.getInteger('rating'));
        // Inbounds
        if (rating < 1 || rating > 5) {
          interaction.reply({
            embeds: [{
              color: '#ff0000',
              title: 'Review',
              description: '❌ **You need to give a rating between 1 and 5.**'
            }],
            ephemeral: true
          });
          return;
        }
        helper = interaction.options.getUser('helper');
        // Not self
        if (helper === interaction.user) {
          interaction.reply({
            embeds: [{
              color: '#ff0000',
              title: 'Review',
              description: '❌ **You can\'t review yourself.**'
            }],
            ephemeral: true
          });
          return;
        }
        // Not bot
        if (helper.bot) {
          interaction.reply({
            embeds: [{
              color: '#ff0000',
              title: 'Review',
              description: '❌ **You can\'t review bots.**'
            }],
            ephemeral: true
          });
          return
        }
        // Save new values
        reviews.add('reviewed-' + interaction.user.id, 1);
        reviews.add('reviews-' + helper.id, 1);
        reviews.add('rating-' + helper.id, rating);

        total_reviews = reviews.get('reviews-' + helper.id);
        ratingoverall = reviews.get('rating-' + helper.id) / total_reviews;

        client.channels.cache.get(Channels.reviews).send({
          content: `<@${helper.id}>`,
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

        // Succes
        await interaction.reply({
          embeds: [{
            color: '#33ccff',
            title: 'Reviewing ' + (helper.displayName ?? helper.username),
            description: '✅ Your review has been sent. Thank you very much!'
          }]
        });
        break;
      case 'profile':
        helper = interaction.options.getUser('user').id||interaction.user.id;
        helper = interaction.guild.members.cache.get(helper);

        // Tier
        let user_tier = 'None';
        let user_rpoints = rewards.get('points-' + helper.id) || 0;
        // Flow Basic
        if (helper._roles.includes('1080800593867706399')) user_tier = '<:Flow_Basic:1168253367143899216> *Flow Basic* ';
        // Flow Plus
        if (helper._roles.includes('1155933625276190770')) user_tier = '<:Flow_Premium:1168253434693169203> **Flow Plus** ';
        // Flow Premium
        if (helper._roles.includes('1171521444967104513')) user_tier = '<:Flow_Premium:1168253434693169203> ***Flow Premium*** ';

        // Badges
        let badges = '';
        // Golden
        if (helper._roles.includes('1025976347266383932')) badges += ':star2: **Golden** ';
        // OG
        if (helper._roles.includes('1025976326542348359')) badges += '<:minecraftHeart:887700546687995964> *OG* ';

        // Reviews
        total_reviews = reviews.get('reviews-' + helper.id);
        ratingoverall = reviews.get('rating-' + helper.id) / total_reviews;

        await interaction.reply({
          embeds: [{
            color: helper.user.accentColor,
            title: (helper.displayName ?? helper.username) + "'s Profile",
            description: `${badges}

:gem: Tier: ${user_tier}
:blue_square: Points: ${user_rpoints}`,
            thumbnail: {
              url: interaction.member.displayAvatarURL()
            },
            fields: [
              {
                name: 'Economy',
                value: `<:Info:1081346731041624125> Total: Unavailable
<:money:1043160500021760071> Wallet: Unavailable
<:creditcard:1043160501292642314> Bank: Unavailable`,
                inline: true
              },
              {
                name: 'Helper',
                value: `Rating: ${ratingoverall} :star:
Reviews: ${total_reviews}`,
                inline: true
              }
            ]
          }],
          ephemeral: false
        });
        break;
      case 'flow':
        await interaction.reply({
          embeds: [{
            color: '#33ccff',
            title: 'S4D Flow',
            description: `Choose the Flow Plan that best fits your needs. Starting at 500 Economy Credits per month or 5000 Credits per year.
Every Flow plan includes:
* Exclusive role with color
* Access to a special chat
* Cool perks`,
            fields: [
              {
                name: '<:Flow_Basic:1168253367143899216> Flow',
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
        break;
    }
  });

  /*client.on('threadCreate', async (s4dThread) => {
    if (s4dThread.parent.id !== Channels.support) return;
    await delay(1000);
    s4dThread.send({
      embeds: [{
        color: '#ff6600',
        title: 'Welcome to support, We\'re here to help!',
        description: `Hello! Welcome to S4D World Support! While you wait for assistance, please explain your problem further and provide screenshots if necessary. This will help us solve your problem faster.
|| If your case is solved, please send \`/solved\` Thank you!||
Good luck with your project! - S4DW Staff`
      }]
    });
  });*/

  /*client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    let argument = message.content.split(' ');
    let command = argument.shift();

        // Counting channel
        if (message.channel.id == '1068486368596082688') {
            if ((message.content ?? '').startsWith('!')) {
                return
            }
            if (message.content == count.get('count') + 1) {
                if (count.get('previous_counter') == message.author.id) {
                    message.reply('Please let somebody else count the next number!')
                        .then(async(s4dfrost_real_reply) => {
                            message.react('❌');
                            await delay(5 * 1000);
                            s4dfrost_real_reply.delete();
                            message.delete();
                        });
                } else {
                    count.add('count', 1);
                    count.set('previous_counter', message.author.id);
                    message.react('✅');
                    try {
                        if (count.get('count') == count.get('goal')) {
                            message.channel.send({
                                embeds: [{
                                    color: '#ffffff',
                                    title: '🎉🎉🎉 GOAL REACHED!!! 🎉🎉🎉',
                                    description: `We hit our goal of \`${count.get('goal')}\`! :tada:
New goal: \`${count.get('goal') + 1000}\``
                                }]
                            })
                                .then(() => {
                                    message.pin()
                                });
                            count.add('goal', 1000);
                            client.channels.cache.get('1068486368596082688').setTopic(`Goal: ${count.get('goal')} | Count here with fellow members! one count per message and wait for someone else to count before sending another message.`);
                        }
                    } catch (err) {
                        message.react('⚠');
                        console.log(err);
                    }
                }
            } else {
                message.react('❌');
                message.reply(`Please stick to the count, next number is ${count.get('count')+1}`)
                    .then(async(s4dfrost_real_reply) => {
                        await delay(5 * 1000);
                        s4dfrost_real_reply.delete();
                        message.delete();
                    });
            }
            return;
        }

        if (command == 'Flow:demoBasic') {
            message.channel.send({
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
                    new Discord.ActionRowBuilder()
                        .addComponents(new Discord.ButtonBuilder()
                            .setCustomId('claimbasic')
                            .setLabel('Claim')
                            .setStyle('PRIMARY'))
                ]
            })
        }
        if (command == 'Flow:demoPlus') {
            message.channel.send({
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
                    new Discord.ActionRowBuilder()
                        .addComponents(new Discord.ButtonBuilder()
                            .setCustomId('claimplus')
                            .setLabel('Claim')
                            .setStyle('PRIMARY'))
                ]
            })
        }
        if (command == 'Flow:demoPremium') {
            message.channel.send({
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
                    new Discord.ActionRowBuilder()
                        .addComponents(new Discord.ButtonBuilder()
                            .setCustomId('claimpremium')
                            .setLabel('Claim')
                            .setStyle('PRIMARY'))
                ]
            })
        }
  });*/
})()