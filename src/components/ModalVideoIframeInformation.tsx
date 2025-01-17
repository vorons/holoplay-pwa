import { memo } from "react";
import { Modal } from "./Modal";
import { Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface ModalVideoIframeInformationProps {
  opened: boolean;
  onClose: () => void;
}

export const ModalVideoIframeInformation: React.FC<ModalVideoIframeInformationProps> =
  memo(({ opened, onClose }) => {
    const { t } = useTranslation();

    return (
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        size="lg"
        title={t("modal.video.iframe.information.title")}
      >
        <Title order={4} mb="xs">
          {t("modal.video.iframe.information.subtitle")}
        </Title>
        <Text mb="xs">{t("modal.video.iframe.information.text1")}</Text>
        <Text mb="xs">
          {t("modal.video.iframe.information.text2")} :{" "}
          <strong>youtube-nocookie.com</strong>
        </Text>
        <Text>{t("modal.video.iframe.information.text3")}</Text>
      </Modal>
    );
  });
