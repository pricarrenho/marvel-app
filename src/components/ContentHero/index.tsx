import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getMarvelHero } from "../../services/api/hero";
import { Container } from "../Container";
import { Button } from "../Button";
import { Loading } from "../Loading";
import Footer from "../Footer";
import { ContentToShowType, Hero } from "./types";
import * as S from "./styles";

export const ContentHero = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [hero, setHero] = useState<Hero>();
  const [contentToShow, setContentToShow] =
    useState<ContentToShowType>("series");

  const contentRef = useRef<HTMLDivElement>(null);

  const title = {
    series: "Series",
    events: "Eventos",
    stories: "Histórias",
  };

  useEffect(() => {
    setIsLoading(true);

    getMarvelHero(params.id).then((value) => {
      setHero(value.data.data.results[0]);
      setIsLoading(false);
    });
  }, [params.id]);

  const handleClick = (value: ContentToShowType) => {
    setContentToShow(value);

    const isMobile = window.innerWidth < 800;

    if (isMobile) {
      window.scrollTo({
        top: contentRef?.current?.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Container>
        <S.Wrapper>
          {isLoading && <Loading size={48} />}

          {hero && (
            <div key={hero.id}>
              <S.WrapperContent>
                <S.Image
                  src={`${hero.thumbnail.path}.${hero.thumbnail.extension}`}
                  alt={hero.id}
                />

                <S.SecondElement>
                  <S.Title>{hero.name}</S.Title>

                  <S.WrapperButton>
                    <Button
                      styleType="primary"
                      onClick={() => handleClick("series")}
                      active={contentToShow === "series"}
                    >
                      Series
                    </Button>

                    <Button
                      styleType="primary"
                      onClick={() => handleClick("events")}
                      active={contentToShow === "events"}
                    >
                      Eventos
                    </Button>

                    <Button
                      styleType="primary"
                      onClick={() => handleClick("stories")}
                      active={contentToShow === "stories"}
                    >
                      Histórias
                    </Button>
                  </S.WrapperButton>
                </S.SecondElement>

                <S.Link to="/">Voltar</S.Link>
              </S.WrapperContent>

              <S.WrapperContentText ref={contentRef}>
                <S.Subtitle>{title[contentToShow]}</S.Subtitle>

                <ul>
                  {hero[contentToShow].items.map((item) => (
                    <S.Description key={item.name}>{item.name}</S.Description>
                  ))}
                </ul>
              </S.WrapperContentText>
            </div>
          )}
        </S.Wrapper>
      </Container>

      <Footer />
    </>
  );
};
