import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // IMPORTANTE
import { LinearGradient } from "expo-linear-gradient";

import { quizData } from "../utils/data/quizData";

import arvore0 from "../assets/IconsLevel/arvore0.png";
import arvore1 from "../assets/IconsLevel/arvore1.png";
import arvore2 from "../assets/IconsLevel/arvore2.png";
import arvore3 from "../assets/IconsLevel/arvore3.png";
import arvore4 from "../assets/IconsLevel/arvore4.png";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);

  // Mapeamento dos ícones baseados na pontuação
  const treeIcons = [arvore0, arvore1, arvore2, arvore3, arvore4, arvore4];

  const getTreeIcon = () => {
    const iconIndex = Math.min(Math.max(score, 0), 5);
    return treeIcons[iconIndex];
  };

  const saveQuizScore = async (score) => {
    try {
      await AsyncStorage.setItem("@quizScore", score.toString());
    } catch (e) {
      console.error("Erro ao salvar pontuação:", e);
    }
  };

  // Use useFocusEffect para controlar o timer e resetar o quiz ao sair da tela
  // ...existing code...
// ...existing code...
useFocusEffect(
  useCallback(() => {
    let timer;
    if (!quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;
          setCurrentQuestion((q) => {
            if (q < quizData.length - 1) {
              setTimeLeft(30);
              return q + 1;
            } else {
              setQuizCompleted(true);
              return q;
            }
          });
          return 30;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      // Remova o reset daqui!
    };
  }, [quizCompleted])
);

// Resetar quiz apenas ao sair da tela (não ao finalizar quiz)
useFocusEffect(
  useCallback(() => {
    return () => {
      setCurrentQuestion(0);
      setScore(0);
      setQuizCompleted(false);
      setTimeLeft(30);
    };
  }, [])
);

  // Salva score ao finalizar quiz
  React.useEffect(() => {
    if (quizCompleted) saveQuizScore(score);
  }, [quizCompleted]);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore((s) => s + 1);
    }
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  const displayAnswers = quizData.map((question, index) => (
    <View key={index} style={styles.answerItem}>
      <Text style={styles.questionText}>
        {`${index + 1}. ${question.question}`}
      </Text>
      <Text style={styles.answerText}>{question.correctAnswer}</Text>
    </View>
  ));

  return (
    <LinearGradient
      colors={["#e0ffe7", "#b2f7c1", "#54B154"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {quizCompleted ? (
          <View style={styles.resultContainer}>
            <Text style={styles.scoreTitle}>SEU RESULTADO</Text>
            <Text style={styles.score}>{score}/5</Text>
            <Image
              source={getTreeIcon()}
              style={styles.treeIcon}
              resizeMode="contain"
            />
            <Text style={styles.sectionTitle}>Respostas Corretas:</Text>
            <View style={styles.answersContainer}>{displayAnswers}</View>
            <TouchableOpacity
              style={styles.retestButton}
              onPress={handleRetest}
            >
              <Text style={styles.buttonText}>FAZER NOVAMENTE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.quizCard}>
            <Text style={styles.question}>
              {quizData[currentQuestion].question}
            </Text>
            <Text style={styles.timer}>
              <Ionicons name="time-outline" size={18} color="#54B154" />{" "}
              {timeLeft}s
            </Text>
            {quizData[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleAnswer(option)}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      ((currentQuestion + 1) / quizData.length) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Pergunta {currentQuestion + 1} de {quizData.length}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    marginVertical: 20,
    width: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  resultContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#54B154",
    width: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000", // alterado para preto
    marginBottom: 10,
    letterSpacing: 1,
  },
  score: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000", // alterado para preto
    marginBottom: 16,
  },
  treeIcon: {
    width: 110,
    height: 110,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // alterado para preto
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  answersContainer: {
    width: "100%",
    marginBottom: 20,
  },
  answerItem: {
    backgroundColor: "#f0faf6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#54B15433",
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  answerText: {
    fontSize: 16,
    color: "#000", // alterado para preto
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000", // alterado para preto
    marginBottom: 4,
  },
  retestButton: {
    backgroundColor: "#54B154",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#000", // alterado para preto
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000", // alterado para preto
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 16,
    color: "#000", // alterado para preto
    marginBottom: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  option: {
    backgroundColor: "#e0ffe7",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#54B154",
    width: 260,
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBarContainer: {
    height: 8,
    width: "100%",
    backgroundColor: "#e0ffe7",
    borderRadius: 6,
    marginTop: 18,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#54B154",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#000", // alterado para preto
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 4,
  },
});
export default Quiz;
