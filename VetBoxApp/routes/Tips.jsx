import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function DicasDeVet() {
  const tips = [
    {
      title: "Vacinas em dia = pet protegido! 💉",
      description:
        "Levar seu pet para vacinar é essencial para prevenir doenças graves. As vacinas obrigatórias variam por espécie e idade — fique atento ao calendário!",
    },
    {
      title: "Check-up anual é vida! 🩺",
      description:
        "Mesmo que seu pet pareça saudável, o check-up com o veterinário ajuda a detectar problemas antes que eles piorem.",
    },
    {
      title: "Alimentação certa, saúde na certa! 🍲",
      description:
        "Evite dar restos de comida. Use rações específicas para a idade, porte e espécie. E atenção: chocolate, uva, cebola e outros alimentos comuns são tóxicos!",
    },
    {
      title: "Parasitas? Nem pensar! 🐛",
      description:
        "Use antipulgas e vermífugos regularmente. Parasitas podem causar doenças e desconforto sério.",
    },
    {
      title: "Exercício é saúde mental também! 🐕‍🦺",
      description:
        "Passeios e brincadeiras ajudam no bem-estar físico e emocional, principalmente para cães e gatos ativos.",
    },
    {
      title: "Caixinha de areia sempre limpa! 🧼",
      description:
        "Para gatos, a higiene da caixa de areia é essencial para evitar infecções e comportamentos indesejados.",
    },
    {
      title: "Hidratação é tudo! 💧",
      description:
        "Água limpa e fresca sempre disponível. Alguns pets bebem pouco — fontes de água (tipo chafariz) podem incentivar.",
    },
    {
      title: "Comportamento estranho? Observe! 👀",
      description:
        "Mudanças de apetite, comportamento ou aparência das fezes são sinais de alerta. Não hesite em procurar o veterinário.",
    },
    {
      title: "Dentes saudáveis, pet feliz! 🦷",
      description:
        "Higiene bucal é importante. Existem escovas e pastas específicas para pets, além de petiscos que ajudam na limpeza.",
    },
    {
      title: "Castração: saúde e prevenção! ✂️",
      description:
        "Castrar evita doenças reprodutivas e comportamentos indesejados, além de ajudar no controle populacional.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dicas de veterinária</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tips.map((tip, idx) => (
          <TouchableOpacity
            style={styles.card}
            key={idx}
            activeOpacity={0.9}
            onPress={() => handleToggle(idx)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{`Dica ${idx + 1}: ${
                tip.title
              }`}</Text>
              <Ionicons
                name={expandedIndex === idx ? "chevron-up" : "chevron-down"}
                size={20}
                color="#464193"
              />
            </View>
            {expandedIndex === idx && (
              <View style={styles.expandedContent}>
                <Text style={styles.description}>{tip.description}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#54B154",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: "#ffffff44",
    padding: 8,
    borderRadius: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 30,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#54B154",
    marginRight: 10,
    flexShrink: 1,
  },
  expandedContent: {
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoContainer: {
    marginTop: 8,
  },
  info: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#54B154",
  },
  emptyMessage: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  specialistBadge: {
    backgroundColor: "#54B154",
    color: "#fff",
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
});
