export const GameResults = ({
  stats, gameSteps, isTeleportMove, isWarpMove, isHammerMode, isWinGame, handleHammerMode
}) => {
  const isWinGameStats = () => (isWinGame
    ? (
      <>
        <h4 className='minimal'><span className='finishPost minimal' /> </h4>
        <h4 className='maximal'>You Win!</h4>
      </>
      )
    : (
      <>
        <h4 className='minimal'>Lv{stats.level}</h4>
        <h4 className='maximal'> Level {stats.level}</h4>
      </>
      ))

  const coinStats = () => (
    <div className='coins'>
      <span className='point' />x{stats.score}
    </div>
  )

  const livesStats = () => (
    <div className='lives'>
      <p>Lives</p>
      <div className='minimal'>
        <span className='plusL minimal' /> x{stats.lives}
      </div>
      {stats.lives > 5
        ? (
          <div className='maximal'>
            <span className='plusL maximal' /> x{stats.lives}
          </div>
          )
        : (
          <div className='maximal'>
            {[...Array(stats.lives)].map((e, i) => {
              return <span key={i} className='plusL maximal' />
            })}
          </div>
          )}

    </div>
  )

  const medalssStats = () => (stats.medals > 0 && (
    <div className='medalC'>
      <p>Medals</p>
      {[...Array(stats.medals)].map((e, i) => {
        return <span key={i} className='medals' />
      })}
    </div>
  ))

  const keyStats = () => (stats.keys > 0 && (
    <div className='keys'>
      <p>Keys</p>
      {[...Array(stats.keys)].map((e, i) => {
        return <span key={i} className='key' />
      })}
    </div>
  )
  )

  const acidStats = () => (stats.acid > 0 && (
    <div className='acidWarning'>
      <p>Acid Warning (2 to game over)</p>
      {[...Array(stats.acid)].map((e, i) => {
        return <span key={i} className='acid' />
      })}
    </div>
  ))

  const isTeleportSignal = () => (isTeleportMove &&
    (
      <div className='teleporting'>
        <p>Go To Direction select cell to land</p>

        <span className='directionup' />

      </div>
    )
  )
  const isWarpSignal = () => (isWarpMove &&
    <div className='warping'>
      <p>Select another warp to go to that location</p>

      <span className='warp' />

    </div>
  )

  const stepCounter = () => (
    <>
      <h5 className='maximal'><span>You made </span> {gameSteps} steps</h5>
      <h5 className='minimal'>
        <span className='stepIcon minimal' /> x{gameSteps}
      </h5>
    </>
  )

  const hammerStatsAndHandler = () => (
    stats.hammer > 0 && (
      <div className='hammers'>
        <p>Hammers</p>
        {!isHammerMode
          ? <p>Click on one to go Through walll</p>
          : <p>Move to go through wall</p>}
        {[...Array(stats.hammer)].map((e, i) => {
          return <span onClick={() => handleHammerMode()} key={i} className='hammer' />
        })}
      </div>
    )

  )

  const isGameOverText = () => (
    (!stats.isMove || stats.lives === 0) && (
      <div className='gameovertext'>
        <p>Cannot continue, consider backtracking </p>
      </div>
    )
  )

  return (
    <div className='results'>
      {isWinGameStats()}
      {stepCounter()}
      {coinStats()}
      {livesStats()}
      {medalssStats()}

      {keyStats()}
      {acidStats()}
      {isTeleportSignal()}
      {isWarpSignal()}
      {hammerStatsAndHandler()}
      {isGameOverText()}
    </div>
  )
}
