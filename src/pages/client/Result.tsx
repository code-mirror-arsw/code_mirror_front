import EvaluationResultsTable from "../../components/client/result/EvaluationResult"; 

export default function Result() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightmode-background dark:bg-background 
    text-lightmode-text dark:text-light transition-colors duration-300 px-4">
      <EvaluationResultsTable />
    </div>
  );
}
