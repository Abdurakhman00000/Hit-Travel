import React, { useEffect, useState } from "react";
import "./PaymentSuccess.css";
import Header from "../../components/Header/Header";
import Loader from "../../components/UI/Loader/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheck, FaDownload } from "react-icons/fa6";
import { getPolicyPdf, getPolicyStatus } from "../../api/insuranceHitTravel";
import { getApiErrorMessage } from "../../api/http";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  const type = searchParams.get("type");
  const policyId = searchParams.get("policy_id");

  useEffect(() => {
    if (type !== "insurance" || !policyId) return;

    const loadPolicy = async () => {
      setLoading(true);
      try {
        const status = await getPolicyStatus(policyId);
        setPolicy(status);
        const policyStatus = status?.nsk_status || status?.status;
        if (policyStatus === "ACTIVATED") {
          const pdf = await getPolicyPdf(policyId);
          setPdfUrl(pdf?.pdf_url || pdf?.url || status?.pdf_url || "");
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [type, policyId]);

  return (
    <div className="payment_success_page">
      <Header>Оплата</Header>
      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <div className="payment_success_card">
            <FaCheck size={48} color="var(--blue)" />
            <h2>Оплата принята</h2>

            {type === "air" && (
              <>
                <p>Билет оформляется автоматически. Проверьте статус в разделе «Мои заказы».</p>
                <button type="button" className="button_form" onClick={() => navigate("/dashboard/history")}>
                  Мои заказы
                </button>
              </>
            )}

            {type === "insurance" && (
              <>
                {(policy?.nsk_status || policy?.status) === "ACTIVATED" ? (
                  <p>
                    Полис активирован. Номер:{" "}
                    <strong>
                      {policy?.nsk_policy_number || policy?.number || "—"}
                    </strong>
                  </p>
                ) : (
                  <p>
                    Полис обрабатывается. Статус:{" "}
                    <strong>
                      {policy?.nsk_status || policy?.status || "CALCULATED"}
                    </strong>
                    {policy?.inspection_status && (
                      <> · Осмотр: {policy.inspection_status}</>
                    )}
                  </p>
                )}
                {error && <p className="payment_error">{error}</p>}
                {pdfUrl && (
                  <a href={pdfUrl} target="_blank" rel="noreferrer" className="button_form payment_success_download">
                    <FaDownload size={18} />
                    Скачать PDF
                  </a>
                )}
                <button type="button" className="button_form insurance_btn_secondary" onClick={() => navigate("/")}>
                  На главную
                </button>
              </>
            )}

            {!type && (
              <>
                <p>Спасибо! Ваш платёж обрабатывается.</p>
                <button type="button" className="button_form" onClick={() => navigate("/")}>
                  На главную
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
