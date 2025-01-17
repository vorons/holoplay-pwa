import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import {
  Card as MCard,
  Text,
  Group,
  ActionIcon,
  createStyles,
  LoadingOverlay,
  Badge,
  Flex,
  UnstyledButton,
  Box,
} from "@mantine/core";
import React, { memo } from "react";
import { Video, VideoThumbnail } from "../types/interfaces/Video";
import { CardMenu } from "./CardMenu";
import { ButtonFavorite } from "./ButtonFavorite";
import { usePlayVideo } from "../hooks/usePlayVideo";
import { displayTimeBySeconds } from "../utils/displayTimeBySeconds";
import {
  usePlayerAudio,
  usePlayerState,
  usePlayerVideo,
} from "../providers/Player";
import { Image } from "./Image";
import { useTranslation } from "react-i18next";

const useStyles = createStyles((theme) => ({
  card: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
  section: {
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
  imageContainer: {
    overflow: "hidden",
    padding: theme.spacing.sm,
    position: "relative",
    minHeight: 152,
    borderRadius: theme.radius.md,
  },
  image: {
    position: "absolute",
    top: "50%",
    left: "50%",
    maxHeight: "110%",
    borderRadius: theme.radius.md,
    transform: "translate3d(-50%, -50%, 0)",
  },
}));

interface CardProps {
  video: Video;
  component?: "div" | "li";
}

export const Card: React.FC<CardProps> = memo(
  ({ video, component = "div" }) => {
    const { handlePlay, loading } = usePlayVideo();
    const { classes } = useStyles();
    const { t } = useTranslation();

    const image = video.videoThumbnails.find(
      (thumbnail) => thumbnail.quality === "maxresdefault"
    ) as VideoThumbnail;

    const videoDuration = displayTimeBySeconds(video.lengthSeconds);

    return (
      <MCard
        withBorder
        component={component}
        radius="md"
        p="sm"
        className={classes.card}
      >
        <HackedCardPress videoId={video.videoId} />
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <UnstyledButton
          style={{ width: "100%" }}
          onClick={() => handlePlay(video.videoId)}
        >
          <CardImage image={image} title={video.title}>
            <Flex
              align="center"
              gap="xs"
              style={{ zIndex: 2, position: "relative" }}
            >
              {videoDuration !== "00:00" ? (
                <Badge variant="filled" size="xs">
                  {videoDuration}
                </Badge>
              ) : null}
              {video.liveNow || videoDuration === "00:00" ? (
                <Badge variant="filled" size="xs" color="red">
                  {t("live")}
                </Badge>
              ) : null}
            </Flex>
          </CardImage>
          <MCard.Section className={classes.section} mt="sm">
            <Group position="apart">
              <Text lineClamp={2} style={{ height: 50 }} title={video.title}>
                {video.title}
              </Text>
            </Group>
          </MCard.Section>
        </UnstyledButton>
        <Group
          mt="xs"
          style={{
            marginTop: 14,
            justifyContent: "flex-end",
            position: "relative",
            zIndex: 3,
          }}
        >
          <ButtonPlayPause
            onClick={() => handlePlay(video.videoId)}
            videoId={video.videoId}
          />
          <ButtonFavorite video={video} />
          <CardMenu video={video} />
        </Group>
      </MCard>
    );
  }
);

const HackedCardPress = memo(({ videoId }: { videoId: string }) => {
  const { video } = usePlayerVideo();

  if (video?.videoId !== videoId) {
    return null;
  }

  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
      }}
    />
  );
});

interface CardImageProps {
  image: VideoThumbnail;
  title: string;
  children: React.ReactNode;
}

const CardImage: React.FC<CardImageProps> = ({ image, title, children }) => {
  const { classes } = useStyles();

  return (
    <Flex
      className={classes.imageContainer}
      align="flex-end"
      justify="flex-end"
    >
      <Image
        src={image?.url as string}
        alt={title}
        className={classes.image}
        loading="lazy"
      />
      {/* <img
        src={image?.url as string}
        alt={title}
        className={classes.image}
        loading="lazy"
      /> */}
      {children}
    </Flex>
  );
};

const ButtonPlayPause = memo(
  ({ onClick, videoId }: { onClick: () => void; videoId: string }) => {
    const { video } = usePlayerVideo();

    if (video?.videoId === videoId) {
      return <ButtonAudioPlayPause />;
    }

    return <ButtonPlay onClick={onClick} />;
  }
);

const ButtonPlay = memo(({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <ActionIcon
      variant="default"
      radius="md"
      size={36}
      style={{ marginRight: "auto" }}
      onClick={() => onClick()}
      title={t("button.play")}
    >
      <IconPlayerPlay size={18} stroke={1.5} />
    </ActionIcon>
  );
});

const ButtonAudioPlayPause = memo(() => {
  const playerAudio = usePlayerAudio();
  const playerState = usePlayerState();
  const { t } = useTranslation();

  const handlePlayPause = () => {
    // @ts-ignore
    const audio = playerAudio?.current?.audioEl.current as HTMLAudioElement;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <ActionIcon
      variant="default"
      radius="md"
      size={36}
      style={{ marginRight: "auto" }}
      title={playerState.paused ? t("button.play") : t("button.pause")}
      onClick={handlePlayPause}
    >
      {playerState.paused ? <IconPlayerPlay /> : <IconPlayerPause />}
    </ActionIcon>
  );
});
