import { judge } from "lib-judge";
import ContestAttempt from "../Models/ContestAttempt.js";
import Contest from "../Models/Contest.js";
import Question from "../Models/Question.js";
import fs from "fs";
import path from "path";

const tmpDir = "./tmp";

const submitCode = async (req, res) => {
  try {
    const { code, language, input, output, timeout, qId,sizeout } = req.body;

    if (!code || !language || !qId) {
      console.warn("[submitCode] Missing required fields");
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const langMap = { python: "py", java: "java", cpp: "cpp" };
    const langCode = langMap[language];
    if (!langCode) {
      console.warn(`[submitCode] Unsupported language: ${language}`);
      return res.status(400).json({ message: "Unsupported language." });
    }

    // Save code to a temporary file
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const tmpPath = path.join(tmpDir, `code_${Date.now()}.${langCode}`);
    fs.writeFileSync(tmpPath, code, "utf-8");

    console.log(`[submitCode] Saved code to: ${tmpPath}`);
    console.log(timeout, input, output);
    const result = await judge({
      codePath: tmpPath,
      ques_name: `question_${Date.now()}`,
      input,
      output,
      timeout: timeout || 2.5,
      sizeout: sizeout ||64,
      language: langCode,
    });

    console.log("[submitCode] Judge returned:", result);
    if (!result) {
      console.error("[submitCode] Judge failed to return results.");
      return res
        .status(500)
        .json({ message: "Judge failed to return results." });
    }

    const allPassed = result.results?.every((tc) => tc.correct === true);
    if (!allPassed) {
      console.log("[submitCode] Some test cases failed:", result.results);
      return res
        .status(200)
        .json({ message: "Some test cases failed", ...result });
    }

    const userId = req.user._id;
    const question = await Question.findById(qId)
    const pid = question.contestId;

    console.log(
      `[submitCode] Logging attempt for user ${userId} on question ${qId} in contest ${pid}`
    );

    let attempt = await ContestAttempt.findOne({ contestId: pid, userId });
    if (!attempt) {
      console.log("[submitCode] Creating new attempt record...");
      attempt = await ContestAttempt.create({
        contestId: pid,
        userId,
        quesAttempt: [qId],
        totalTimeTaken: 0,
        Total_Score: question.points || 0,
        attemptques: 1,
      });
    } else {
      console.log("[submitCode] Updating existing attempt...");
      if (!attempt.quesAttempt.includes(qId)) {
        attempt.quesAttempt.push(qId);
      }
      attempt.attemptques += 1;
      attempt.Total_Score = (attempt.Total_Score || 0) + (question.points || 0);
    }
    console.log(question.points, " points")
    const contest = await Contest.findById(pid);
    const startTime = new Date(contest.startTime).getTime();
    const timeTakenNow = Date.now() - startTime;
    attempt.totalTimeTaken = (attempt.totalTimeTaken || 0) + timeTakenNow;

    await attempt.save();

    console.log("[submitCode] Submission completed successfully", attempt);

    return res.status(200).json({
      message: "All test cases passed!",
      allPassed: true,
      jobId: result.jobId,
      results: result.results,
    });
  } catch (err) {
    console.error("[submitCode] Submit error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { submitCode };
