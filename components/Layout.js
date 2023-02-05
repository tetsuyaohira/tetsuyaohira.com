import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'

const name = 'Tetsuya Ohira / 大平 哲也'
export const siteTitle = "Tetsuya Ohira's Blog"

const StyledContainer = styled.div`
  max-width: 1244px;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
`
const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledBackToHome = styled.div`
  margin: 3rem 0 0;
`
const StyledHeaderHomeImage = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 1000px;
`
const StyledHeaderImage = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 1000px;
`
const StyledSiteTitle = styled.h1`
  font-size: 2.5rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.05rem;
  margin-top: 1rem;
  margin-bottom: 0;
`

function Layout({children, home}) {
    return (
        <StyledContainer>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <StyledHeader>
                {home ? (
                    <>
                        <StyledHeaderHomeImage
                             src="/images/profile.jpg"/>
                        <StyledSiteTitle>{siteTitle}</StyledSiteTitle>
                    </>
                ) : (
                    <>
                        <StyledHeaderImage src="/images/profile.jpg"/>
                        <StyledSiteTitle>{siteTitle}</StyledSiteTitle>
                    </>
                )}
            </StyledHeader>
            <main>{children}</main>

            {!home && (
                <StyledBackToHome>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </StyledBackToHome>
            )}
        </StyledContainer>
    )
}

export default Layout
