import Ques from "../Models/Question.js";
import Contest from "../Models/Contest.js";
import ContestAttempt from "../Models/ContestAttempt.js";

const createcontest = async (req, res) => {
  const { multipleQues, startTime, endTime, contesttitle, contestdesc } =
    req.body;
  //muQ:[title, desc, input, expectedOutput,]
  const user = req.user;
  try {
    const createcontest = new Contest({
      quesId: [],
      contesttitle: contesttitle,
      contestdesc: contestdesc,
      createdby: user._id,
      startTime,
      endTime,
      userId: [],
    });
    await createcontest.save();
    const ques = await Promise.all(
      multipleQues.map(async (m) => {
        const createQues = new Ques({
          title: m.title,
          difficulty: m.difficulty,
          timeLimit: m.timeLimit,
          points: m.points,
          mermoryLimit: m.mermoryLimit,
          desc: m.description,
          input: m.testCases.input,
          expectedOutput: m.testCases.expectedOutput,
          contestId: createcontest._id,
        });
        await createQues.save();
        return createQues;
      })
    );
    createcontest.quesId = ques.map((q) => q._id);
    await createcontest.save();
    console.log("wokr");
    return res.status(200).json({
      contest: {
        ...createcontest.toObject(),
        _id: createcontest._id,
      },
      questions: ques.map((q) => ({
        _id: q._id,
        title: q.title,
        desc: q.desc,
        input: q.input,
        expectedOutput: q.expectedOutput,
      })),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error while creating contest." });
  }
};

const allContest = async (req, res) => {
  try {
    const alllist = await Contest.find();
    return res.status(200).json({
      alllist,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error while creating contest." });
  }
};

const fetch_multiple = async (req, res) => {
  try {
    const { ids } = req.body;
    const questions = await Ques.find({ _id: { $in: ids } });
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

const startContest = async (req, res) => {
  const { id } = req.body;
  try {
    const contest = await Contest.findById(id);
    contest.userId.push(req.user._id);
    await contest.save();
    const attempt = new ContestAttempt({
      contestId: contest._id,
      userId: req.user._id,
      quesAttempt: [],
      starttime: Date.now(),
      totalTimeTaken: Date.now(),
      attemptques: 0,
      Total_Score: 0,
    });
    await attempt.save();
    return res.status(200).json({ contest, attempt });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

const rankcontest = async (req, res) => {
  const { cid } = req.params;
  console.log(cid)

  try {
    const attempts = await ContestAttempt.find({ contestId: cid })
      .populate("userId", "username")
      .sort([
        ["Total_Score", -1],          // Match exactly as per schema
        ["totalTimeTaken", 1],        // Lower time wins in case of tie
      ]);

    const rankings = attempts.map((a, idx) => ({
      rank: idx + 1,
      userId: a.userId._id,
      username: a.userId.username,
      Total_Score: a.Total_Score || 0,
      totalTimeTaken: a.totalTimeTaken || 0,
    }));

    res.status(200).json(rankings);
  } catch (err) {
    console.error("Rank fetch error:", err);
    res.status(500).json({ message: "Failed to fetch contest rankings" });
  }
};



export { createcontest, allContest, fetch_multiple, startContest,rankcontest };
