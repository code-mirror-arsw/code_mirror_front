import EvaluationResultsDashboard from "../../components/admin/interview/result/EvaluationResultsDashboard"; 

export default function ResultAdmin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightmode-background dark:bg-background 
    text-lightmode-text dark:text-light transition-colors duration-300 px-4">
      <EvaluationResultsDashboard />
    </div>
  );
}
