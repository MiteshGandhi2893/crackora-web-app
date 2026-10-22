import { test } from "@playwright/test";
import { HeaderPage } from "../../pages/header.page";
import { ExamMegaMenuPage } from "../../pages/exam-mega-menu.page";

test("user opens exam mega menu from navbar and sees exams", async ({
  page,
}) => {
  const header = new HeaderPage(page);
  const megaMenu = new ExamMegaMenuPage(page);

  const lawExams = [
    { meta_title: "CLAT", title: "CLAT" },
    {
      meta_title:
        "CUET PG LLB 2027 – Eligibility, Exam Pattern, Syllabus, Dates, Application & Complete Guide",
      title: "CUET PG LLB",
    },
    {
      meta_title:
        "MH CET LAW 5 Years 2027 – Eligibility, Syllabus, Exam Pattern, Dates, Application, Colleges",
      title: "MH CET LAW 5 Years",
    },
    {
      meta_title:
        "SLAT 2027 | Symbiosis Law Admission Test – Dates, Eligibility, Pattern, Syllabus & More",
      title: "SLAT",
    },
    {
      meta_title:
        "AILET 2027 – Eligibility, Syllabus, Exam Pattern, Dates, Application, Result & Cut-Off",
      title: "AILET",
    },
    {
      meta_title:
        "CULEE 2027: Christ University Law Entrance Exam – Eligibility, Syllabus, Exam Pattern, Dates, Colleges",
      title: "CULEE/Christ University",
    },
    {
      meta_title:
        "CUET UG LLB 2027 – Eligibility, Syllabus, Exam Pattern, Colleges & Preparation Guide",
      title: "CUET UG LLB",
    },
    {
      meta_title:
        "NLAT 2027 | NMIMS Law Admission Test | Exam Dates, Eligibility, Pattern, Syllabus, Results & Preparation Guide",
      title: "NLAT",
    },
    {
      meta_title:
        "MH CET LAW 3 Years 2027 – Eligibility, Syllabus, Exam Pattern, Dates & Colleges",
      title: "MH CET LAW 3 Years",
    },
  ];
  const mcaExams = [
    {
      meta_title:
        "TANCET MCA 2027 – Notification, Eligibility, Syllabus, Exam Pattern, Dates & Colleges",
      title: "TANCET",
    },
    {
      meta_title:
        "CUET PG MCA 2027 | Exam Dates, Syllabus, Eligibility, Pattern, Notification, Application & Complete Guide",
      title: "CUET PG MCA",
    },
    {
      meta_title:
        "Complete Guide: Eligibility, Exam Pattern, Syllabus, Dates & Admission Process",
      title: "IPU CET MCA 2027",
    },
    {
      meta_title:
        "MAH MCA CET 2027 – Dates, Eligibility, Syllabus & Exam Pattern | Crackora",
      title: "MAH MCA CET",
    },
    {
      meta_title:
        "NIMCET 2027 – Exam Dates, Syllabus, Pattern & NIT Colleges | Crackora",
      title: "NIMCET 2027",
    },
  ];

  await header.goto();

  for (const exam of lawExams) {
    await header.openExamsMenu();
    await megaMenu.clickEntrances("LAW Entrance");
    await megaMenu.isVisible(`[data-examcard-title="${exam.title}"]`);
    await megaMenu.clickExamCard(`[data-examcard="${exam.title}"]`);
    await megaMenu.isVisible(`[data-examinfo-title="${exam.meta_title}"]`);
  }

  for (const exam of mcaExams) {
    await header.openExamsMenu();
    await megaMenu.clickEntrances("MCA Entrance");
    await megaMenu.isVisible(`[data-examcard-title="${exam.title}"]`);
    await megaMenu.clickExamCard(`[data-examcard="${exam.title}"]`);
    await megaMenu.isVisible(`[data-examinfo-title="${exam.meta_title}"]`);
  }
});
