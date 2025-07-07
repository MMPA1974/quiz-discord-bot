require("dotenv").config();
const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});

const QUESTIONS = [
  {
    question: "Quelle est la majoration légale des 8 premières heures supplémentaires ?",
    options: ["10%", "25%", "50%", "15%"],
    correct: 1
  },
  {
    question: "Combien de jours de carence en cas de maladie ?",
    options: ["1", "2", "3", "4"],
    correct: 2
  },
  {
    question: "Le seuil des heures supplémentaires est ?",
    options: ["35h", "39h", "43h", "48h"],
    correct: 1
  },
  {
    question: "Quel organisme recouvre les cotisations retraite ?",
    options: ["URSSAF", "CPAM", "AGIRC-ARRCO", "Pôle Emploi"],
    correct: 2
  },
  {
    question: "Quand doit-on remettre le bulletin de paie ?",
    options: ["Tous les 15 jours", "Chaque mois", "Chaque trimestre", "Chaque semaine"],
    correct: 1
  },
  {
    question: "La DSN signifie ?",
    options: ["Déclaration Sociale Nominative", "Dossier Social National", "Déclaration Sécurité Nationale", "Droits Sociaux Nominatifs"],
    correct: 0
  },
  {
    question: "Le SMIC est revalorisé ?",
    options: ["Chaque année", "Chaque trimestre", "Jamais", "Tous les 6 mois"],
    correct: 0
  }
];

client.once("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const [qIndex, choice] = interaction.customId.split("_");
  const question = QUESTIONS[qIndex];

  if (!question) return;

  const isCorrect = Number(choice) === question.correct;

  await interaction.reply({
    content: isCorrect ? "✅ Bonne réponse !" : "❌ Mauvaise réponse.",
    ephemeral: true
  });
});

client.on("messageCreate", async message => {
  if (message.content === "!quiz") {
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];

      const row = new ActionRowBuilder().addComponents(
        q.options.map((opt, idx) =>
          new ButtonBuilder()
            .setCustomId(`${i}_${idx}`)
            .setLabel(opt)
            .setStyle(ButtonStyle.Primary)
        )
      );

      const embed = new EmbedBuilder()
        .setTitle(`Question ${i + 1}`)
        .setDescription(q.question)
        .setColor(0x00AE86);

      await message.channel.send({
        embeds: [embed],
        components: [row]
      });
    }
  }
});

client.login(process.env.TOKEN);
